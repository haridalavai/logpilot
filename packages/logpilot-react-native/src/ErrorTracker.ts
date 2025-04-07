import { InjestPayload } from "@logpilot/common";
import axios from 'axios';

interface ErrorTrackerConfig {
  apiKey: string;
  apiUrl: string;
  enableConsoleCapture?: boolean;
  enableNetworkCapture?: boolean;
  source: string;
  tags?: string[];
  environment?: string;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private config: ErrorTrackerConfig;
  private originalConsoleError: typeof console.error;
  private isInitialized: boolean = false;

  private constructor(config: ErrorTrackerConfig) {
    this.config = config;
    this.originalConsoleError = console.error;
  }

  public static getInstance(config?: ErrorTrackerConfig): ErrorTracker {
    if (!ErrorTracker.instance) {
      if (!config) {
        throw new Error('ErrorTracker config is required');
      }
      ErrorTracker.instance = new ErrorTracker(config);
    }
    return ErrorTracker.instance;
  }

  public init(): void {
    if (this.isInitialized) {
      return;
    }

    // Set up global error handler
    ErrorUtils.setGlobalHandler(this.handleError.bind(this));

    // Capture console errors if enabled
    if (this.config.enableConsoleCapture) {
      this.setupConsoleCapture();
    }

    // Capture network errors if enabled
    if (this.config.enableNetworkCapture) {
      this.setupNetworkCapture();
    }

    this.isInitialized = true;
  }

  private async handleError(error: Error): Promise<void> {
    try {
      const errorReport: InjestPayload = {
        name: error.name,
        message: error.message,
        type: 1,
        timestamp: Date.now().valueOf().toString(),
        device: await this.getDeviceInfo(),
        source: this.config.source,
        tags: this.config.tags,
        breadcrumbs: this.getBreadcrumbs(),
        user: {},
        extra: {},
        environment: this.config.environment || 'development',
        stacktrace: error.stack,
        level: 'error',
      };

      // Send error to your backend
      await this.sendErrorReport(errorReport);
    } catch (e) {
      // Fallback to original console.error if something goes wrong
      this.originalConsoleError('Error in ErrorTracker:', e);
    }
  }

  private async getDeviceInfo() {
    try {
      const { Platform } = require('react-native');
      const Constants = require('expo-constants').default;

      return {
        platform: Platform.OS,
        version: Platform.Version,
        expoVersion: Constants.expoVersion,
        deviceName: Constants.deviceName,
        ...Constants.platform,
      };
    } catch (e) {
      return {
        platform: 'unknown',
        version: 'unknown',
      };
    }
  }

  private async sendErrorReport(report: InjestPayload): Promise<void> {
    // Implement your error reporting logic here
    // This could be an API call to your backend service
    const url = this.config.apiUrl;
    const apiKey = this.config.apiKey;
    console.log('Error report:', report);
    console.log('URL:', url);
    console.log('API Key:', apiKey);
    try {
      const response = await axios.post(url, report, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      console.log('Response:', response);
    } catch (error) {
      console.error('Error sending error report:', error);
    }
  }

  private setupConsoleCapture(): void {
    console.error = (...args: any[]) => {
      this.handleError(new Error(args.join(' ')));
      this.originalConsoleError.apply(console, args);
    };
  }

  private setupNetworkCapture(): void {
    // Implement network error capturing logic
  }

  private setupBreadcrumbCapture(): void {
    // Implement breadcrumb capturing logic
  }

  private getBreadcrumbs(): Record<any, any>[] {
    // Implement breadcrumb capturing logic
    return [];
  }
}

export default ErrorTracker; 
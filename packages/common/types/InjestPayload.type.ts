export type InjestPayload = {
   timestamp: string;
   source: string;
   type: number;
   name: string;
   message: string;
   level?: string;
   environment?: string;
   stacktrace?: string;
   tags?: string[];
   user?: Record<any, any>;
   extra?: Record<any, any>;
   device?: Record<any, any>;
   breadcrumbs?: Record<any, any>[];
}

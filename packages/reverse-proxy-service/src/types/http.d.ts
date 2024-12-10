import * as http from 'http';

declare module 'http' {
    interface Agent {
        maxHeaderSize?: number;
    }
}

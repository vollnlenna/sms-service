import { Request } from 'express';

export interface RequestWithDevice extends Request {
  device?: {
    id_device: number;
  };
}

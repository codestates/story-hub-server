import { Request, Response } from 'express';
import commitModels from '../models/commitModels';
import { getUserInfo } from './common/function';

const commitModule = {
  create: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitList: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitUpdate: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitDelete: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitLike: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitDisLike: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  myPageCommit: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitDepth: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitAlertList: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitUpdateAlert: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
  commitMerge: async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.send('hi');
    } catch (err) {
      return res.send(err);
    }
  },
};

export default commitModule;

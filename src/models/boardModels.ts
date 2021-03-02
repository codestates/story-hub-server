import connect from '../database';
import { AddBoard } from '../interface/Board';
// import {  } from '../interface/Board';

const boardModels = {
  createBoard: async (args: AddBoard): Promise<void> => {
    try {
      console.log(args);
    } catch (err) {
      console.log('hi');
    }
  },
};

export default boardModels;

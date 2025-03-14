import { AnyZodObject } from "zod";
import express, { NextFunction, Request, Response } from "express";
//higher order function
const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      next();
    } catch (err) {
      next();
    }
  };
export default validateRequest;

import { BaseModelButtons } from "./data/base.model";

export type DATA_operation_formula = {
    operation: BaseModelButtons['symbol'][]
    formula: BaseModelButtons['formula'][]
};

export type NUMBER_factorialnumgetter = {
    toReplace: String,
    replacement: String
};

export type MyCallback = (name:number) => number | void;
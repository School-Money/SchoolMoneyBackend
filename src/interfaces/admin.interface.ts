import { Parent } from "src/schemas/Parent.schema";

export interface GetParentsDto extends Parent {
    isTreasurer: boolean;
}

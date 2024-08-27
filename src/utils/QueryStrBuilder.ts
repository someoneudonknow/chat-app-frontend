type Operators = ">" | ">=" | "<" | "<=" | "=";

export default class QueryStrBuilder {
  private queryObj: Record<string, any> = {};
  private readonly operatorsMap: Record<Operators, string> = {
    ">": "gt",
    ">=": "gte",
    "<": "lt",
    "<=": "lte",
    "=": "",
  };

  constructor() {}

  public addParam(
    field: string,
    operator: keyof typeof this.operatorsMap,
    value: any
  ): typeof this {
    if (operator != "=") {
      this.queryObj[`${field}[${this.operatorsMap[operator]}]`] = value;
    } else {
      this.queryObj[field] = value;
    }

    return this;
  }

  public build(): string {
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(this.queryObj)) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          queryParams.append(key, item);
        });
      } else {
        queryParams.set(key, value);
      }
    }

    return queryParams.toString();
  }
}

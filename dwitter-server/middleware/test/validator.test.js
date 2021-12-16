import httpMocks from "node-mocks-http";
import faker from "faker";
import * as validator from "express-validator";
import { validate } from "../validator.js";

jest.mock("express-validator");

describe("Validator Middleware", () => {
  it("returns next() when error is empty", () => {
    const response = httpMocks.createResponse();
    const request = httpMocks.createRequest({
      method: "POST",
      url: "/tweets",
    });
    const next = jest.fn();
    validator.validationResult = jest.fn(() => ({ isEmpty: () => true }));

    validate(request, response, next);

    expect(next).toBeCalled();
  });

  it("returns 400 if there are validation error", () => {
    const response = httpMocks.createResponse();
    const request = httpMocks.createRequest({
      method: "POST",
      url: "/tweets",
    });
    const next = jest.fn();
    validator.validationResult = jest.fn(() => ({
      isEmpty: () => false,
      array: () => [{ msg: "Error!" }],
    }));

    validate(request, response, next);

    expect(next).not.toBeCalled();
    expect(response.statusCode).toBe(400);
    expect(response._getJSONData().message).toBe('Error!');
  });
});

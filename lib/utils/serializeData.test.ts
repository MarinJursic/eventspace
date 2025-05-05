/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from "vitest";
import { serializeData } from "./serializeData"; // Adjust import path
import { Types } from "mongoose";

describe("serializeData Utility", () => {
  it("should return null for null input", () => {
    expect(serializeData(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(serializeData(undefined)).toBeNull();
  });

  it("should return an empty array for an empty array input", () => {
    expect(serializeData([])).toEqual([]);
  });

  it("should return the same primitive value for primitives", () => {
    expect(serializeData(123)).toBe(123);
    expect(serializeData("hello")).toBe("hello");
    expect(serializeData(true)).toBe(true);
  });

  it("should serialize a simple object", () => {
    const data = { a: 1, b: "test" };
    expect(serializeData(data)).toEqual({ a: 1, b: "test" });
  });

  it("should serialize an object containing a Date object to an ISO string", () => {
    const date = new Date();
    const data = { timestamp: date };
    expect(serializeData(data)).toEqual({ timestamp: date.toISOString() });
  });

  it("should serialize an object containing a MongoDB ObjectId to its string representation", () => {
    const objectId = new Types.ObjectId();
    const data = { _id: objectId, name: "test" };
    // Simulate Mongoose toObject behavior for the test
    const plainData = {
      id: objectId.toString(),
      _id: objectId.toString(),
      name: "test",
    };
    expect(serializeData(plainData)).toEqual({
      id: objectId.toString(),
      _id: objectId.toString(),
      name: "test",
    });
  });

  it("should serialize an array of objects with Dates and ObjectIds", () => {
    const date1 = new Date();
    const date2 = new Date(date1.getTime() + 10000);
    const id1 = new Types.ObjectId();
    const id2 = new Types.ObjectId();
    const data = [
      { _id: id1, timestamp: date1 },
      { _id: id2, timestamp: date2 },
    ];
    // Simulate Mongoose toObject behavior
    const plainData = [
      { id: id1.toString(), _id: id1.toString(), timestamp: date1 },
      { id: id2.toString(), _id: id2.toString(), timestamp: date2 },
    ];
    expect(serializeData(plainData)).toEqual([
      {
        id: id1.toString(),
        _id: id1.toString(),
        timestamp: date1.toISOString(),
      },
      {
        id: id2.toString(),
        _id: id2.toString(),
        timestamp: date2.toISOString(),
      },
    ]);
  });

  it("should handle nested objects", () => {
    const date = new Date();
    const id = new Types.ObjectId();
    const data = {
      level1: {
        _id: id,
        level2: {
          timestamp: date,
          value: "nested",
        },
      },
    };
    // Simulate Mongoose toObject behavior
    const plainData = {
      level1: {
        id: id.toString(),
        _id: id.toString(),
        level2: {
          timestamp: date,
          value: "nested",
        },
      },
    };
    expect(serializeData(plainData)).toEqual({
      level1: {
        id: id.toString(),
        _id: id.toString(),
        level2: {
          timestamp: date.toISOString(),
          value: "nested",
        },
      },
    });
  });

  // Simulate a Mongoose document with a toObject method
  it("should call toObject if it exists and serialize the result", () => {
    const date = new Date();
    const id = new Types.ObjectId();
    const mockMongooseDoc = {
      _id: id,
      timestamp: date,
      someVirtual: "virtualValue", // Added virtual
      toObject: function ({ virtuals = false } = {}) {
        const obj: any = {
          _id: this._id, // Keep original ObjectId for stringify
          timestamp: this.timestamp, // Keep original Date for stringify
        };
        if (virtuals) {
          obj.id = this._id.toString(); // Add virtual 'id'
          obj.someVirtual = this.someVirtual;
        }
        return obj;
      },
    };

    // Expect serialization *with* virtuals because serializeData calls toObject({ virtuals: true }) internally (implicitly)
    // The JSON.stringify step handles the conversion of ObjectId and Date
    const expected = {
      id: id.toString(), // Virtual included
      _id: id.toString(), // ObjectId converted to string
      timestamp: date.toISOString(), // Date converted to string
      someVirtual: "virtualValue", // Virtual included
    };

    expect(serializeData(mockMongooseDoc)).toEqual(expected);
  });

  it("should handle BigInt by converting to string", () => {
    const data = { bigNumber: BigInt(9007199254740991) };
    expect(serializeData(data)).toEqual({ bigNumber: "9007199254740991" });
  });

  it("should return null if JSON.stringify throws an error (e.g., circular reference)", () => {
    const circular: any = { name: "circular" };
    circular.self = circular; // Create circular reference
    expect(serializeData(circular)).toBeNull(); // Expect null on error
  });

  it("should return empty array if input is array and JSON.stringify throws", () => {
    const circular: any = { name: "circular" };
    circular.self = circular;
    const data = [circular];
    expect(serializeData(data)).toEqual([]); // Expect empty array on error
  });
});

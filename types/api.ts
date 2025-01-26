import { NextResponse } from "next/server";

export type APIResponse<T> = T extends Promise<NextResponse<infer R>> ? R : T;

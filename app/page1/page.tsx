"use client";

import React, { Suspense } from "react";
import Page1Content from "./Page1Content";

export default function Page1() {
    return (
        <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Page1Content />
        </Suspense>
    );
}
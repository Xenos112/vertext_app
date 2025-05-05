"use client";
import React, { Suspense } from "react";
import UsersSuggestions from "./UsersSuggestions";
import UsersSuggestionsSkeleton from "./UsersSuggestionsSkeleton";
import CommunitiesFeedSkeleton from "./CommunitiesFeedSkeleton";
import CommunitiesFeed from "./CommunitiesFeed";

export default function RightFloatMenu() {
  return (
    <div className="absolute top-12 right-12 space-y-6">
      <Suspense fallback={<UsersSuggestionsSkeleton />}>
        <UsersSuggestions />
      </Suspense>
      <Suspense fallback={<CommunitiesFeedSkeleton />}>
        <CommunitiesFeed />
      </Suspense>
    </div>
  );
}

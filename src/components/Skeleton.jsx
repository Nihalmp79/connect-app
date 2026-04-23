// Base skeleton block — pulsing gray rectangle
const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
)

// Skeleton for a single post card
export const PostSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <SkeletonBlock className="w-9 h-9 rounded-full" />
      <div className="flex-1">
        <SkeletonBlock className="h-3 w-24 mb-2" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>

    {/* Content lines */}
    <SkeletonBlock className="h-4 w-full mb-2" />
    <SkeletonBlock className="h-4 w-5/6 mb-2" />
    <SkeletonBlock className="h-4 w-4/6 mb-4" />

    {/* Image placeholder — shows sometimes */}
    <SkeletonBlock className="h-48 w-full mb-4 rounded-lg" />

    {/* Actions */}
    <div className="flex gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
      <SkeletonBlock className="h-4 w-12" />
      <SkeletonBlock className="h-4 w-12" />
    </div>
  </div>
)

// Skeleton for profile header
export const ProfileSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-16 h-16 rounded-full" />
        <div>
          <SkeletonBlock className="h-5 w-32 mb-2" />
          <SkeletonBlock className="h-4 w-48" />
        </div>
      </div>
      <SkeletonBlock className="h-9 w-24 rounded-lg" />
    </div>
    <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="text-center">
        <SkeletonBlock className="h-5 w-8 mx-auto mb-1" />
        <SkeletonBlock className="h-3 w-10 mx-auto" />
      </div>
      <div className="text-center">
        <SkeletonBlock className="h-5 w-8 mx-auto mb-1" />
        <SkeletonBlock className="h-3 w-16 mx-auto" />
      </div>
      <div className="text-center">
        <SkeletonBlock className="h-5 w-8 mx-auto mb-1" />
        <SkeletonBlock className="h-3 w-16 mx-auto" />
      </div>
    </div>
  </div>
)

// Multiple post skeletons for feed
export const FeedSkeleton = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </>
)
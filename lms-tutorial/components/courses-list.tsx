import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "@/components/search-input";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string}[];
    progress: number | null;
};

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
    isSearchPage: boolean;
    isDashboardPage: boolean;
    isHomePage: boolean;
}

export const CoursesList = ({
    items,
    isSearchPage,
    isDashboardPage,
    isHomePage
}: CoursesListProps) => {
    return (
        <div>
            {items.length === 0 && (
                <div className="text-center py-12 px-4">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                        <BookOpen className="w-12 h-12 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                        No courses found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Start your learning journey by exploring our courses
                    </p>
                    <Link href="/search">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            Browse Courses
                        </Button>
                    </Link>
                </div>
            )}
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <CourseCard 
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chaptersLength={item.chapters.length}
                        price={item.price!}
                        progress={item.progress}
                        category={item?.category?.name!}
                    />
                ))}
            </div>
            {(isSearchPage || isDashboardPage || isHomePage) && (
                <div className="hidden md:block w-[300px] ml-8">
                    <SearchInput/>
                </div>
            )}
        </div>
    )
}
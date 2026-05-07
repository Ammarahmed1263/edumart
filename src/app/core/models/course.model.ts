export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Instructor {
  _id: string;
  userName: string;
  email: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  instructor: Instructor;
  averageRating: number;
  numReviews: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewStudent {
  _id: string;
  userName: string;
  email: string;
}

export interface Review {
  _id: string;
  student: ReviewStudent;
  course: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  _id: string;
  title: string;
  content?: string;
  courseId: string;
  instructorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  imageUrl?: string;
  categoryName?: string;
  instructorName?: string;
}


export interface CoursesResponse {
  status: string;
  data: {
    page: number;
    totalPages: number;
    total: number;
    results: number;
    courses: Course[];
  };
}

export interface MyCoursesResponse {
  status: string;
  data: {
    results: number;
    courses: Course[];
  };
}

export interface SingleCourseResponse {
  status: string;
  data: {
    course: Course;
  };
}

export interface CategoriesResponse {
  status: string;
  data: {
    categories: Category[];
  };
}

export interface ReviewsResponse {
  status: string;
  data: {
    results: number;
    reviews: Review[];
  };
}

export interface LessonsResponse {
  status: string;
  data: {
    page: number;
    totalPages: number;
    total: number;
    results: number;
    lessons: Lesson[];
  };
}

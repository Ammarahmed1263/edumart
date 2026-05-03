import { Component } from '@angular/core';
import { Hero } from '../../features/home/hero/hero';
import { Categories } from '../../features/home/categories/categories';
import { LatestCourses } from '../../features/home/latest-courses/latest-courses';

@Component({
  selector: 'app-home-page',
  imports: [Hero, Categories, LatestCourses],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {}

/*
 * Copyright (c) 2013, Bo Fu 
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
 
This analysis tool is compatible with Tobii 2150  eye tracker and the ClearView 2.7.1. 

Inputs: Tobii Recording Data 

Outputs (validated results):

A. Measures of Search:

	1. Pupil Metrics
	- average pupil size of left eye
	- average pupil size of right eye. 
	- average pupil size of both eyes.


2.  Fixation Metrics 

	a. General
	- total number of fixations;

	b. Duration Descriptive Stats
	- sum of all fixation duration; 
	- mean duration; 
	- median duration;
	- StDev of durations; 
	- Min. duration;
	- Max. duration;  


3. Saccade Metrics

	a. General
	- total number of saccades;
 
	b. Length Descriptive Stats
	- sum of all saccade length; 
	- mean saccade length;
	- median saccade length; 
	- StDev of saccade lengths;
	- min saccade length; 
	- max saccade length; 

	
	d. Absolute Angle Descriptive Stats
	- sum of all absolute degrees; 
	- mean absolute degree; 
	- median absolute degree; 
	- StDev of absolute degrees; 
	- min absolute degree; 
	- max absolute degree; 

	e. Relative Angle Descriptive Stats
	- sum of all relative degrees; 
	- mean relative degree; 
	- median relative degree; 
	- StDev of relative degrees; 
	- min relative degree; 
	- max relative degree;

4. Fixation and Saccades
- fixation to saccade ratio; 
- convex hull area. 



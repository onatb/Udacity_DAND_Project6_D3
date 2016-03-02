## Udacity Data Analyst Nanodegree Project 6
### Titanic Visualization Using D3.js
by Arif Hikmet Onat Balta

#### Summary
This chart is designed to be a different kind of donut chart. Instead of showing survival rates directly on the chart area, 
this visualization allows users to investigate titanic dataset as they wish. Users are encouraged to click on different 
combinations of features to find the group with the highest survival rate.

#### Design
In my visualization, I used a different type of donut chart and in final version, I used color hue for feature types and
for survival rate. I used a simple layout with a white background and avoid using complex components in order to keep the
attention. There is a basic hierarchy in my visualization, in which similar features are listed side by side.

I downloaded the data set from the Vanderbilt University website, which is identical to Kaggle's Titanic data set. 
The only difference is, Kaggle provides Titanic data set in two seperate parts because of it's competition purposes. 
For minimizing data munging time I used Vanderbilt's data set.

After downlading and cleaning the data, I came up with the question "Were some groups of people more likely to survive than others?"
Next step is to find a way to answer this question by highlighting some patterns so that my story conveys the overall 
message to readers. In other words, I have to create a visualization that is  answering this question, by giving 
information between those passengers who survived and those who died.

I considered using bar charts, which would explain the survival rate but I thought it would be an exploratory visualization 
instead of an explanatory data visualization so I started investigating different kinds of visualizations and came up with
an idea of using a different kind of donut chart. I influenced much from [Kerry Rodden's Sequences Sunburst] (www.bl.ocks.org/kerryrodden/7090426) 
and [Nadieh Bremer’s Text on an Arc] (http://bl.ocks.org/nbremer/bf6d15082ea81ce69b55) visualizations.
Instead of narrating one part of the data set, I thought it would be a better idea to allow users to investigate the whole data set.
So I created the initial visualization using d3.js, where each arc represents a feature and when these arcs come together, they form 
a special type of donut chart. Each arc has it's own color and explanation on hover (I used [Color Brewer](www.colorbrewer2.org/)  
website in order to make easily focusable features). 

Users can select groups as they wish. After each selection, survival ratio is displayed in the middle of the donut chart. 
It is easy to understand which features are selected and what is the survival ratio of this selection. At this point, 
user can either select additional features or start selecting other diverse combinations.

A preview of the initial visualization can be seen below or on bl.ocks [here](http://bl.ocks.org/onatb/e98d00f27e6d3598df7a)

![Preview of the initial visualization](http://imagizer.imageshack.us/v2/640x480q90/921/PIfIfD.png)

After getting the feedback, I fixed some things in my visualization:

- Increased the duration of the story, giving users more time to read the whole story and understand the main aim of the visualization
- Added information about survival ratio. Now it indicates the highest ratio and gives more hint to user
- Added color on survival ratio.Red,  if it is below 55%, yellow between 55-80% and green for higher scores.
- Changed the arc text "Best" to "Hint" to make it more understandable.

A preview of the final visualization can be seen below or on bl.ocks [here](http://bl.ocks.org/onatb/9fe16602b54a8c285c24)

![Preview of the final visualization](http://imagizer.imageshack.us/v2/640x480q90/923/dgSrFh.png)

#### Feedback
I gathered feedback from 3 different people. I asked them:

+ What do you notice in the visualization?
+ What questions do you have about the data?
+ What relationships do they notice?
+ What is the main takeaway from this visualization?
+ Is there something complex in the graphic?

Responses are shown below:

1. Your chart looks good. I understand that it is about Titanic and the survival ratios. I think women are 
more lucky in surviving than other groups. Travelling in a higher class also effects the survival ratio.
My highest score was 96.53%. Am I on the right track? I think you should fix this part and give some more 
feedback to user because I don't know the highest score. It can be 100% or something over 96%. You should inform me.
Still, your visualization looks nice and informative. I didn't know that some groups survived with such a high percent.

2. I couldn't read the very first text displayed on chart because it disappeared so fast. I didn't quite get the main 
thing I guess. It took me a while to understand what the chart is about. As I figured out, your visualization is about 
Titanic and the percent displayed in the middle explains a survival ratio, changing according to my selections. If I 
understood it right, it looks like this is a very interesting chart. You let users to investigate Titanic passengers 
and their survival ratios. I believe it will be a better chart, if you fix the problem I figured out.

3. I liked your visualization. It was so fun playing around with different features and trying to increase the survival ratio.
I knew a bit about the Titanic passengers so it's not a hard thing for me to find the group that has the highest ratio
but you should include more things to "best" option. I mean you should inform people that doesn't know much about titanic.
By the way, it will be better if you change "Best" to "Hint" because "Best" option with giving some hints doesn't make any sense. 
Overall, it's a great visualization about survival ratios of Titanic passengers. I liked the idea of investigating whole thing myself.
I noticed if you were a little girl travelling in first class and with 1 parent, you would survive with a 100% probability. So nice!

#### Resources
[Kaggle Titanic](www.kaggle.com/c/titanic) |
[Wikipedia - Titanic] (www.en.wikipedia.org/wiki/Passengers_of_the_RMS_Titanic) |
[Titanic: Behind the numbers] (www.optional.is/required/2012/04/25/titanic-visualized/) |
[Placing Texts On Arcs] (www.visualcinnamon.com/2015/09/placing-text-on-arcs.html) |
[Sequences Sunburst] (www.bl.ocks.org/kerryrodden/7090426) |
[D3: Enter, Update, Exit] (www.medium.com/@c_behrens/enter-update-exit-6cafc6014c36#.jh54dwby2) |
[Animations-Transitions With D3] (www.blog.visual.ly/creating-animations-and-transitions-with-d3-js/) |
[Coffee Wheel] (www.jasondavies.com/coffee-wheel/) | 
[Color Brewer] (www.colorbrewer2.org/) |
[D3.js] (www.d3js.org/)

##### Data
biostat.mc.vanderbilt.edu/wiki/pub/Main/DataSets/titanic3.xls







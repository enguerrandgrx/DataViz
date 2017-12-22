# Process Book

### Overview, motivation, target audiance

1 October 2017, Las Vegas: The Deadliest US Mass Shooting ever 59 killed and 527 people Injured. This kind of news has become more and more regular these last years. The number of attacks had increase as well as their magnitude. 

In this project our motivation was to try to understand when, where and why those attacks take place. 

In the first time we sought to best showed the increase of mass shooting over time, and in a second time we are interested at different carateristique at the state scale, such as the population, the number of gun fire by habitant and firegun law. 

### Related work and inspiration



### What am I trinying to show in my viz ? 

### Dataset

We use Data from different sources. 

First we take data about shooting, on US Mass Shooting from [Kaggle: US Mass Shootings][1], then we find data for the year 2017 from [gunviolencearchive][2]. 

Second we find data about Fire gun law in US by state on the [theguardian][3] and the number of fire gun on eatch state from [Wikipedia][4]. 

And finaly we extract data about the population for eatch state on 2016 from [wikipedia][8], and for previous years from [The Censuse Office][9]. 

[1]: https://www.kaggle.com/zusmani/us-mass-shootings-last-50-years
[2]: http://www.gunviolencearchive.org/reports/mass-shooting
[3]: https://www.theguardian.com/world/interactive/2013/jan/15/gun-laws-united-states
[4]: https://fr.wikipedia.org/wiki/Liste_des_%C3%89tats_am%C3%A9ricains_par_possession_d%27armes_%C3%A0_feu
[8]: https://fr.wikipedia.org/wiki/D%C3%A9mographie_des_%C3%89tats-Unis
[9]: https://www2.census.gov/programs-surveys/popest/tables/1900-1980/counties/totals/e7079co.txt


Processing Steps: 

For all the processing we use Python 3.6

First we had to get the data, for kaggle is quit simple but for other source we use differents technique of Web Scraping using library [requests][5] and [BeautifulSoup][6]. 

When this was done, we focused on the cleaning and improving data. 

As we need the coordinate of eatch shooting we start by filling missing cordinate using the location and the module geopy.geocoders from [Nominatim][7]. Then we extract the State ID from the Location in order to make an analysis state by state.   

[5]: http://docs.python-requests.org/en/master/
[6]: https://www.crummy.com/software/BeautifulSoup/bs4/doc/
[7]: https://github.com/damianbraun/nominatim

### Exploratory data analysis

After recover all the data we need and cleaning them, we start to visualized our data using python again in order to ge a better insights of the data. 

We use barplot using [seaborn][10] to visualized number of attack, killed and injured poeple by year, then we group by state and sum the number of attack, killed and injured people. At this step we have a good understanding of attacks over the time and at a the state level. 

Our next step was to creat a maps using [d3js][11] of the US coutry with a slide range to have a nice representation of attack over de time by state. 

Then we combine data on fiergun law and our data set. We first select interesting law on this dataset, we select two law, one on the [open][12] and [concealed][13] of firegun and one on the 'First Shoot'. To see is there is a relation about those regulation and the number of attack we merge datafram and make a ratio by the population of each state. For example we try to see if there is less victimes in state where 'First Shoot' is authorized than is those where is prohibited. 

[10]: https://seaborn.pydata.org/
[11]: https://d3js.org/
[12]: https://en.wikipedia.org/wiki/Open_carry_in_the_United_States
[13]: https://en.wikipedia.org/wiki/Concealed_carry_in_the_United_States


### Designs 



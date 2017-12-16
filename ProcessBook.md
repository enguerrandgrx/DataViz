# Process Book

### Overview, motivation, target audiance



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




### Designs 

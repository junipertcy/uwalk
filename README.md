# Urban Walkability Project
- [Noise Diagonotor for New York City](http://uwalk.elasticbeanstalk.com/noise)

This repo stores the web system of the urban walkability project, initiated by Dr. Cheng-Te Li in Academia Sinica, Taiwan, and currently maintained by Mr. Tzu-Chi Yen. The project aims to collect urban multi-modal data and suggest open algorithmic models to offer insights for social good. Its first deployment was on urban noise, in which the noise composition of any place in a city can be inferred from multimodal multimedia.

# Documentation
The NYC Urban Noise Diagnotor system is developed to allow users to understand the noise composition of any region of NYC in an interactive manner. Its essential function is to visualize the degree of noise pollution (highlighted by different colors) for each grid in New York City. The noise pollution is derived from the volume of noise complaints, which are either obtained from both the NYC 311 noise data (for grids having adequate noise complaints) and the inferred noise composition by our UND model (for grids without or having rare complaints). When users select a certain grid, the corresponding noise composition will be displayed. The corresponding multimodal geo- social media information will be presented as well, including the category distribution of locations from Foursquare, the number of check-ins from Twitter, and few representative venue names with photos from Flickr. Moreover, users are allowed to input the addresses to understand the noise pollution of their nearby areas, and choose the time period of interest (i.e., seasons, weekday/weekend, and hours of day) to observe how noise pollution varies in the selected grid.


# Publication
The work has been presented at the ACM Multimedia 2015 conference in Brisbane, Australia. We were the Grand Challenge finalist under IBM's New York City 360˚ Challenge. If you use our algorithm in your research, you can cite the following work in your publications:

>######What Makes New York So Noisy? Reasoning Noise Pollution by Mining Multimodal Geo-Social Big Data
*Hsun-Ping Hsieh, Tzu-Chi Yen, and Cheng-Te Li* in Grand Challenge, ACM International Conference on Multimedia (MM’ 15), Brisbane, Australia, Oct. 26-30, 2015.

# License
UWalk and all it's compoents are released under the MIT license.
# Future Work
- Research new algorithmic cores: city bike service logs (?)
- Improve functionality: SQL layer not play well

# Contact
Hsun-Ping Hsieh <d98944006@csie.ntu.edu.tw>
National Taiwan University Taipei, Taiwan

Tzu-Chi Yen <junipertcy@gmail.com>
Sensoro Technology Co., Ltd., Beijing, China

Cheng-Te Li <ctli@citi.sinica.edu.tw>
Academia Sinica Taipei, Taiwan
 

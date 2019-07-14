# Temporal Sentiment Analysis
### By CurryEaters (Tharangni H Sivaji and Marco Heuvelman)

The aim of our study was to see how the sentiment of a Wikipedia article is distributed across the page. This is done by assigning sentiments to each paragraph of an article. Sentiments are assigned on a scale from -5 to 5 with-5 indicating most negative and 5 indicating most positive. We scraped the articles and performed basic sentiment analysis using a set of predefined positive and negative words. This process was done using Python with libraries such as pandas and nltk. This data was later plotted using d3.js (ver 5.0) to visualize the variation. 

Dir files: Wikipedia html documents, list of positive and negative words for sentiment analysis, html file for viewing the visualization, python script for scraping and analyzing, javascript file for visualizing.

Python packages required: pandas, nltk, tqdm, json, lxml

Preferred browser: Firefox or Edge. Avoid Chrome

Code execution:

1.	Sentiment analysis: In a command line with a virtual environment (preferred) type the following after switching to the current directory – `python main.py`
	- This will generate a "trial.json" file which is later used for visualization
2.	Visualization: Open "view_visualization.html" in any of the preferred browsers.
	- x axis denotes the normalized paragraphs for each document
	- Variation per document can be selected by interacting with the items on the left of the webpage

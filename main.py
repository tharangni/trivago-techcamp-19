import os
import re
import json
import nltk

import pandas as pd

from lxml import html
from tqdm import tqdm

class ArticleReader(object):
	"""
	Input: Wikipedia path directory where the files are stored

	Reads all files from the said directory and converts it into a dataframe with document id, 
	document path, paragraph id, paragraph text, preprocessed paragraph and sentiment score
	"""
	def __init__(self, wikiDir):
		super(ArticleReader, self).__init__()
		self.wikiDir = wikiDir
		self.files = [os.path.join(self.wikiDir, f) for f in os.listdir(self.wikiDir) if os.path.isfile(os.path.join(self.wikiDir, f))] #list of files in the dir

	def readFiles(self):

		self.df = pd.DataFrame(columns=["doc_id", "doc_path", "para_id", "para", "preprocess", "sentiment"])

		for docID, file in enumerate(tqdm(self.files)):
			doc = "DOC_0{}".format(docID)
			f = file.strip().split("/")[-1].strip().split(".")[0]
			with open(file, "rb") as reader:
				page = reader.read()

			tree = html.fromstring(page)
			
			paragraphs = tree.xpath('//*[@id="mw-content-text"]/div/p')

			for pID, p in enumerate(paragraphs):
				para = "{}_P_0{}".format(doc, pID)
				text = p.text_content()
				prep = re.sub("\[[^]]*\]", "", text)
				prep = prep.lower()

				temp_dict = {"doc_id": doc, "doc_path": f, "para_id": para, "para": p.text_content(), "preprocess": prep, "sentiment": "0"}
				self.df = self.df.append(temp_dict, ignore_index=True)

class SentimentTagger(object):
		"""
		Input: Processed dataframe from article reader, file with positive and negative list of sentiment words
		Returns: Updated dataframe with sentiment score per paragraph per document
		"""
		def __init__(self, df, pos, neg):
			super(SentimentTagger, self).__init__()
			self.df = df
			self.pos = set()
			self.neg = set()

			with open(pos, "r") as positives:
				pos_reader = positives.readlines()

			for line in pos_reader:
				if not line.startswith(";"):
					self.pos.add(line.rstrip("\n"))

			with open(neg, "r") as negatives:
				neg_reader = negatives.readlines()

			for line in neg_reader:
				if not line.startswith(";"):
					self.neg.add(line.rstrip("\n"))
 			
 			# call to assign sentiment scores
			self.df["sentiment"] = self.df["preprocess"].apply(lambda x: self.analyze(x))

			# save dataframe as json for visualization
			self.df = self.df.groupby(['doc_id', 'doc_path'], as_index=False).apply(lambda x: x[['para_id', 'para', 'preprocess', 'sentiment']].to_dict('r')).reset_index().rename(columns={0:'para_data'})
			self.df.to_json("./trial.json", orient='records')

		def analyze(self, text):
			"""Analyze text for sentiment, returning its score."""

			# compares every word in text with the list of positive and negative
			sentimentscore = 0

			tokenizer = nltk.tokenize.TweetTokenizer()
			word = tokenizer.tokenize(text)

			# scores every word
			for i in range(len(word)):
			    if word[i].lower() in self.pos:
			        sentimentscore += 1
			    if word[i].lower() in self.neg:
			        sentimentscore -= 1

			if sentimentscore > 5:
				sentimentscore = 5
			if sentimentscore < -5:
				sentimentscore = -5

			return sentimentscore


if __name__ == '__main__':
	f = ArticleReader("./wikipedia/")
	f.readFiles()
	o = SentimentTagger(f.df, "positive-words.txt", "negative-words.txt")




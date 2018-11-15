# d3 Word Frequency Cloud

## The goal is to extract the most frequently mentioned skills in the 4000+ job descriptions
    - Use regular expression to split the job_description string into individual words.

    - Design word_counter function to count the frequency of each word

    - Set up a stopwords list based on NLTK's list of english stopwords: https://gist.github.com/sebleier/554280. Add words to the list as needed.

    - Set up a targetwords list to analyze the frequency of specific programming skills.

    - Cluster words with similar meanings, such as "analysis", "analyses" and "analytical".

    - To draw the word cloud, we referred to the d3 Word Cloud Layout library: https://github.com/jasondavies/d3-cloud
    
    - Tweak the color using d3-scale-chromatic: https://github.com/d3/d3-scale-chromatic

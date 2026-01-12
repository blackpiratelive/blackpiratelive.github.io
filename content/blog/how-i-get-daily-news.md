---
title: "How I get Daily News"
date: 2024-06-23T23:13:00+05:30
tags: [obsidian, android, kindle]
---

In this post I would discuss how I read news on my kindle, benefit of my method and how you can replicate this method by yourself. 


## How to Replicate
### Prerequisites:
1. A smartphone with Termux and Anlinux installed. There must be at least 2 GB of storage free.
2. Patience 
3. Time on your hand.


### Installing a Linux distro on termux

Open the an Linux app and on the dashboard choose **Fedora** and click *ok*. 
Now click *copy* and it should copy a command to your clipboard. 
Now click on *launch* and it would open termux terminal. 
Now first run the command ``pkg update && pkg upgrade``
If you are prompted to answer type Y and hit enter to upgrade. 
Wait till it finishes downloading and installing the packages. 
Now paste the copied command from the above step and hit *enter*. 
Give it time to download and install required packages. Make sure you have a fast internet connection. 
It should install everything and set up your Fedora Linux distro. 

### Installing calibre and setting up
After it finishes, type ``./start-fedora.sh`` and hit enter. It should give you a shell. *[root@localhost -] #* 
Now in that shell run ``dnf update && dnf upgrade && dnf install calibre`` 
This command updates the system and installs calibre. 

### Finding your favorite newpaper
Calibre has a long list of recipes (scripts to fetch news) for different websites both regional and global. 
To see the whole list of all available inbuilt recipes run the command: 
`ebook-convert --list-recipes`
The list would be pretty big and you won't be able to locate the particular news website you want. So I suggest you use grep to filter out only the one you need. For example if I want The Hindu Newspaper I would run the following command:
`ebook-convert --list-recipes | grep "Hindu"`
{{< figure src="img/IMG_20240623_224043.jpg" title="The Hindu recipes" >}}
From the list shown I want "The Hindu" one specifically. 

You can get your news in different formats, in my case I prefer .mobi format, as it shows progress of each article. You are free to choose any format you want. 

### Making a  git repository to store the news files 
I have a script that I have made with the help of chatGPT to download that newspaper automatically and save it in a particular git repo inside my termux, such that it pushes it to my website and makes it easy for me to download the file to my kindle through its inbuilt browser. 

If you don't have a git repository to store the news ebooks follow the steps below. If you are not interested in pushing the news files to a git repo skip to the next section.

1. Go to github.com and create a repository. Name it whatever you wish.
2. Copy the url of the repository. 
3. Come back to termux and install git by running `dnf install git` 
4. Now run `git clone [your repo url]`
5. Now it should clone it to your termux home directory. 

### Downloading the news and moving it to the repository 

The following script downloads the news and moves it to my _files_ repository. 

```
#!/bin/bash

# Define the recipe file and the output file name  
RECIPE_FILE="The Hindu.recipe"  
OUTPUT_PROFILE="kindle"  
OUTPUT_FILE="The Hindu $(date '+%B %d, %Y').mobi"

# Create a temporary file to capture the output  
TEMP_OUTPUT=$(mktemp)

# Run the ebook-convert command and tee the output to both console and the temp file  
ebook-convert "$RECIPE_FILE" "$OUTPUT_FILE" --output-profile "$OUTPUT_PROFILE" 2>&1 | tee "$TEMP_OUTPUT"

# Check if the ebook-convert command was successful  
if [ ${PIPESTATUS[0]} -ne 0 ]; then  
  echo "Error: ebook-convert command failed."  
  cat "$TEMP_OUTPUT"  
  rm -f "$TEMP_OUTPUT"  
  exit 1  
fi

# Extract the output file path from the command output  
OUTPUT_PATH=$(grep -oP 'Output saved to\s+\K.*' "$TEMP_OUTPUT")

# Check if the output path was found  
if [ -z "$OUTPUT_PATH" ]; then  
  echo "Error: Could not find the output file path in the command output."  
  rm -f "$TEMP_OUTPUT"  
  exit 1  
fi

# Define the target directory  
TARGET_DIR="/root/files/news/the-hindu"

# Check if the target directory exists  
if [ ! -d "$TARGET_DIR" ]; then  
  echo "Error: Target directory $TARGET_DIR does not exist."  
  rm -f "$TEMP_OUTPUT"  
  exit 1  
fi

# Move the output file to the target directory  
mv "$OUTPUT_PATH" "$TARGET_DIR"

# Check if the move was successful  
if [ $? -ne 0 ]; then  
  echo "Error: Failed to move the file to $TARGET_DIR."  
  rm -f "$TEMP_OUTPUT"  
  exit 1  
fi

# Clean up temporary file  
rm -f "$TEMP_OUTPUT"

echo "File successfully moved to $TARGET_DIR"
```


It runs the ebook-convert command to download the news and saves it as a mobi file. I file name grabs automatically the current date. Then it saves it to my repository "files". 

### Uploading the downloaded file to my website
Now you can commit the changes and push it to the GitHub. I have a vercel website that transforms the git repo into a website of file manager. Someday I hope to move to Hugo and use only html to show the file lists. 

### Reading on Kindle
After the file has been pushed to my website, I open the kindle and open the web browser. Now go to the website and download the file. It should download easily and thereafter you can read it without worries. 


## Conclusion 
Kindle is a great device. Getting your daily news by this method means you can get it for free, and the sexy e-ink display would be utilized. 

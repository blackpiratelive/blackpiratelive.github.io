---
title: "Get Self Hosted Analytics for Your Website Free"
date: 2026-04-04T11:33:29+05:30
tags: [website, guide, self-host]
---
So you  have quit social media and made your own website. You have started writing blog posts and slowly your website is getting visitors. People are reading your posts and commenting or sending you emails about what they think about your post. Congratulations. Now you want to see which posts of yours are popular or from where are you getting bulk of your visitors. But you do not wan to use mainstream analytics like google analytics or something. Because privacy my dude. So the next step is self hosting. You are looking for ways to self host an analytics tool. There are some great ones. But it should be easy to set up, set it and forget it. You dont want to be a sysadmin now do you?

In this guide I'll tell you how to install umami analytics on vercel and set it up. This can be done entirely using free limits of vercel, and works pretty well for a small indieweb site. 

### Step One: Fork Umami Repository on Github and Import
Go to the following link, https://github.com/umami-software/umami and fork this repository. You must have a github account and logged in. Then go to vercel.com, login, connect to your github account to import projects and import the repo you have just forked. Then click on deploy. This would trigger a deploy but it would fail as we have not set up postgres database yet. Do not worry if you do not understand what it is. I will guide you step by step. 

### Step two: Set Up DB for umami
Now after the deployment has failed there would be an option that says go to project. Click on that. It should open the project page. You should see options like overview, deployments etc. here you have to find the storage option and click on that.
It should open a new page like this picture below. Here you have to click on Neo (serverless postgres) and click on click create.
{{< img src="/img/db-page.png" >}}
Here it might ask you to agree to their terms and service, you have to agree to that. Then it asks for configuration. Choose the location where you want to keep your db (physical location of the server) then chooose the free plan. (Free plan is plenty enough for running a self hosted instance of umami for indieweb sites. you may need paid plans if your site gets lots of visitors.) After you have configured the db click on create. It should take few seconds to create the db and then it will show the following conformation that your db is created successfully. 
{{< img src="/img/db-configure.png" >}}
{{< img src="/img/db-create-success.png" >}}

### Integrating db With Umami. 
It would now ask you to integrate the db to a project. Choose the umami project, do not add any custom prefix. It will fail the deployment if you add custom prefix. After you click connect it would link the db to the umami projct. Now go to the projects section of your vercel account and go to the deployment page of your umami project. Here you will have to redeploy the project. Click on 3 dot icon at the right hand side and choose create deployment. Choose the branch master then click on create deployment. The deployment should run and it would pass. Congratulations, your own instance of umami analytics has been deployed. 
{{< img src="/img/create-deploy.png" >}}

### Setting up your website in Umami
Now go to the deployd url, vercel automatically generates an url for your project. It should open umami login screen. Here you have to type in username ```admin``` and password ```umami`` to login.

{{< img src="/img/umami-login.png" >}}

This should log you in and open the dashboard. Now at the left hand side where it says shows your username ```admin``` click on that and it would open settings. In the settings page under profile section there is option to change password. Change it to something strong. This step is very important. Since umami is hosted to the internet anyone can access your umami instance and "hack it" if you do not change the default password. After this is done, it is time to set up your website. 

In the websites section, click on add a new website at the top right corner. Here you enter your website name and the domain of your site. It can be a subdomain also such as something.bearblog.dev. After you click save click on the edit icon next to it. This should open a new section where it shows details of your website. Copy the tracking code. 

{{< img src="/img/tracking-code.png" >}}

### Adding the tracking code to your website
This step is very easy. Paste the copied code to the footer or head of your document. Make sure all the pages of your site has this tracking script. 


If you have any questions you can email me or comment below. Thank you for reading. 

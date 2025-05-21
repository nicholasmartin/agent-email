Reply-To Addresses
Article Preview
Overview
Understanding the context
Implementing the solution
Determining your sending method
Sending with the API
Sending with SMTP
Need Support?
Overview
Mailgun supports using a Reply-To address through the h:Reply-To parameter (API) and Reply-To: header (SMTP).

However, the Reply-To address must be added to the message by your sending application before submitting the message to Mailgun for processing and delivery. 

 

Understanding the context
You're following all the email best practices including sending from a subdomain with MX records pointing to Mailgun (right?!).  Even the From address uses the subdomain to ensure you're DMARC-aligned and ready to pass Sender Address Verification.  Perhaps you even have Mailgun Routes set up to process any incoming email arriving to your subdomain.  

Nonetheless, you have reasons for needing any replies to return to your personal address (like a @outlook.com address) rather than the address listed in the From field.  If only you had... a Reply-To address! 

Mailgun allows you to add Reply-To addresses to your emails, but it's important to note the Reply-To address must be set within the message before your application sends the email to Mailgun for processing and delivery. 

 

Implementing the solution
 

Determining your sending method
It's important to confirm whether your application sends email by API or SMTP.  Your IT technician, team, or department can confirm the sending method and assist with any needed configuration changes to enable the use of the Reply-To address. 

 

Sending with the API
If you're using the API natively, you'll need to add the following parameter: 
h:Reply-To = 'user@domain.tld"
If you're using the API through a framework or plugin, it is possible the h:Reply-To parameter is not supported. As such, we recommend contacting the support team of said application to confirm whether adding the parameter is possible.
Below is an API request that utilizes the h:Reply-To parameter:

curl -s --user 'api:YOUR_API_KEY' \
    https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
    -F from='Mailgun User <from.addy@YOUR_DOMAIN_NAME>' \
    -F to='to.addy@domain.tld' \
    -F h:Reply-To='reply.addy@personal-domain.tld' \
    -F subject='Howdy!' \
    -F text='Testing the awesomeness that is Mailgun!'
 

Sending with SMTP
If you're using SMTP with a technically-robust (i.e. high technical complexity) email application, adding the Reply-To header will be possible. The header will appear like so:
Reply-To: user@domain.tld
If you're using SMTP with a user-friendly (i.e. low technical complexity) email application, it is possible the Reply-To: header is not supported. As such, we recommend contacting the support team of said application to confirm whether adding the header is possible.
Below is a set of email headers that utilizes the Reply-To: header:

Date: Fri, 04 Jun 2021 11:30:00 +0000
Sender: mailgunner@mg.secretdomain.com
Message-Id: <20210604200808.1.43ADC7BEFFD9C87A@mg.secretdomain.com>
Reply-To: mypersonalaccount@outlook.com
To: testmailbox@gmail.com
From: Jeff <mailgunner@mg.secretdomain.com>
Subject: Test: Send Message #1
Content-Type: text/plain; charset="ascii"
Mime-Version: 1.0
Content-Transfer-Encoding: 7bit

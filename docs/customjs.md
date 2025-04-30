# Agent Email Custom JavaScript Integration Guide

This document outlines the implementation of a custom JavaScript solution that allows customers to integrate Agent Email with their existing web forms without modifying their backend code.

## Overview

The Agent Email JavaScript integration provides a simple way for customers to connect their lead capture forms to the Agent Email service. The script:

1. Listens for form submissions on the customer's website
2. Identifies target forms using various selectors
3. Extracts lead information (name, email, etc.)
4. Sends the data to the Agent Email API
5. Doesn't interfere with the normal form submission process

## Implementation Steps

### 1. Create the JavaScript Library

Create a JavaScript file (`agent-email.js`) that will be hosted on a CDN:

```javascript
/**
 * Agent Email Form Integration
 * Version: 1.0.0
 * 
 * This script allows websites to automatically send form submissions
 * to Agent Email for personalized email generation.
 */
(function() {
  // Default configuration
  const DEFAULT_CONFIG = {
    apiEndpoint: 'https://api.agent-email.com/client/process-lead',
    formSelectors: ['[data-agent-email="true"]'],
    fieldMappings: {
      firstName: ['first_name', 'firstname', 'fname', 'first'],
      lastName: ['last_name', 'lastname', 'lname', 'last'],
      email: ['email', 'email_address', 'user_email']
    },
    debug: false
  };

  // Merge default config with user-provided config
  const config = window.AgentEmailConfig 
    ? { ...DEFAULT_CONFIG, ...window.AgentEmailConfig }
    : DEFAULT_CONFIG;
    
  // Extract API key from script tag or config
  const scriptTag = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  const apiKey = config.apiKey || scriptTag.getAttribute('data-api-key');
  
  if (!apiKey) {
    console.error('Agent Email: No API key provided. Please set your API key.');
    return;
  }

  // Function to check if a form should be processed
  function shouldProcessForm(form) {
    // If no selectors specified, don't process any forms
    if (!config.formSelectors || config.formSelectors.length === 0) {
      return false;
    }
    
    // Check if the form matches any of our selectors
    return config.formSelectors.some(selector => {
      try {
        const matchingElements = document.querySelectorAll(selector);
        return Array.from(matchingElements).includes(form);
      } catch (e) {
        if (config.debug) {
          console.error('Agent Email: Invalid selector', selector, e);
        }
        return false;
      }
    });
  }

  // Function to extract form data based on field mappings
  function extractFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Try to find matching fields for each required property
    for (const [targetField, possibleFields] of Object.entries(config.fieldMappings)) {
      // Check form elements by name attribute
      for (const fieldName of possibleFields) {
        const element = form.elements[fieldName];
        if (element && element.value) {
          data[targetField] = element.value;
          break;
        }
        
        // Also check if the field exists in FormData
        const formValue = formData.get(fieldName);
        if (formValue) {
          data[targetField] = formValue;
          break;
        }
      }
    }
    
    // Add any custom fields if specified
    if (config.customFields) {
      for (const [customField, selector] of Object.entries(config.customFields)) {
        try {
          const element = form.querySelector(selector);
          if (element && element.value) {
            data[customField] = element.value;
          }
        } catch (e) {
          if (config.debug) {
            console.error(`Agent Email: Error extracting custom field ${customField}`, e);
          }
        }
      }
    }
    
    return data;
  }

  // Function to send data to Agent Email
  function sendToAgentEmail(data) {
    // Only proceed if we have an email address
    if (!data.email) {
      if (config.debug) {
        console.error('Agent Email: No email address found in form data', data);
      }
      return;
    }
    
    if (config.debug) {
      console.log('Agent Email: Sending data to API', data);
    }
    
    fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      if (config.debug) {
        console.log('Agent Email: API response', result);
      }
      
      // Call onSuccess callback if provided
      if (typeof config.onSuccess === 'function') {
        config.onSuccess(result);
      }
    })
    .catch(error => {
      if (config.debug) {
        console.error('Agent Email: API Error', error);
      }
      
      // Call onError callback if provided
      if (typeof config.onError === 'function') {
        config.onError(error);
      }
    });
  }

  // Listen for form submissions across the site
  document.addEventListener('submit', function(event) {
    const form = event.target;
    
    // Only process forms that match our selectors
    if (!shouldProcessForm(form)) {
      return;
    }
    
    if (config.debug) {
      console.log('Agent Email: Form submission detected', form);
    }
    
    // Extract the data we need
    const leadData = extractFormData(form);
    
    // Send to Agent Email in the background
    sendToAgentEmail(leadData);
    
    // The form continues its normal submission process
  }, false);
  
  // Log initialization if debug mode is on
  if (config.debug) {
    console.log('Agent Email: Initialized with config', config);
  }
})();
```

### 2. Set Up CDN Hosting

1. Host the JavaScript file on a CDN (e.g., Cloudflare, AWS CloudFront)
2. Ensure the CDN has proper CORS headers to allow cross-origin requests
3. Set up versioning to allow for future updates

### 3. Create Customer Integration Documentation

Provide customers with the following integration options:

#### Option 1: Basic Integration (Simplest)

```html
<!-- Add this script to your website before the closing </body> tag -->
<script src="https://cdn.agent-email.com/js/agent-email.js" data-api-key="CUSTOMER_API_KEY"></script>

<!-- Then add the data-agent-email="true" attribute to your lead forms -->
<form data-agent-email="true">
  <!-- Form fields -->
</form>
```

#### Option 2: Advanced Configuration

```html
<!-- Add this configuration before loading the script -->
<script>
  window.AgentEmailConfig = {
    apiKey: "CUSTOMER_API_KEY",
    formSelectors: ["#contact-form", ".lead-form", "form[name='signup']"],
    fieldMappings: {
      firstName: ["first_name", "firstname"],
      lastName: ["last_name", "lastname"],
      email: ["email", "user_email"]
    },
    customFields: {
      company: "#company-field",
      jobTitle: "input[name='job_title']"
    },
    debug: false,
    onSuccess: function(result) {
      console.log("Lead successfully sent to Agent Email");
    },
    onError: function(error) {
      console.error("Error sending lead to Agent Email", error);
    }
  };
</script>
<script src="https://cdn.agent-email.com/js/agent-email.js"></script>
```

### 4. Form Identification Methods

Explain to customers how they can identify their forms using various selectors:

| Method | Example | Description |
|--------|---------|-------------|
| ID | `#contact-form` | Target a form with a specific ID |
| Class | `.lead-form` | Target all forms with a specific class |
| Name | `form[name="contact"]` | Target forms with a specific name attribute |
| Data Attribute | `[data-agent-email="true"]` | Target forms with a custom data attribute (recommended) |
| Action URL | `form[action="/submit-lead"]` | Target forms that submit to a specific URL |
| Method | `form[method="POST"]` | Target forms with a specific HTTP method |
| Combined | `form.contact-form#main-form` | Use any combination of selectors |

### 5. Field Mapping Configuration

Explain how field mapping works:

```javascript
fieldMappings: {
  // Agent Email field: [possible form field names]
  firstName: ["first_name", "firstname", "fname", "first"],
  lastName: ["last_name", "lastname", "lname", "last"],
  email: ["email", "email_address", "user_email"]
}
```

The script will try each possible field name in order until it finds a match in the customer's form.

### 6. Dashboard Integration

Create a section in the Agent Email dashboard where customers can:

1. Generate their custom script tag with their API key
2. Configure form selectors through a visual interface
3. Map their specific form fields to Agent Email fields
4. Test the integration with sample submissions
5. View debug logs for troubleshooting

## Security Considerations

1. **API Key Protection**: 
   - Generate API keys with limited permissions (only lead submission)
   - Implement rate limiting to prevent abuse
   - Consider domain restrictions for API keys

2. **Data Protection**:
   - Only collect the minimum required information
   - Provide clear privacy policy guidelines for customers
   - Implement proper data handling in accordance with GDPR/CCPA

3. **CORS Configuration**:
   - Set up proper CORS headers to allow the script to work across domains
   - Consider implementing domain whitelisting for API requests

## Implementation Timeline

1. **Phase 1**: Develop and test the core JavaScript library
2. **Phase 2**: Set up CDN hosting and versioning
3. **Phase 3**: Create dashboard integration for configuration
4. **Phase 4**: Develop comprehensive documentation and examples
5. **Phase 5**: Implement analytics and monitoring

## Future Enhancements

1. **Form Auto-Detection**: Automatically detect and suggest forms on customer websites
2. **Field Auto-Mapping**: Use AI to automatically map customer form fields to Agent Email fields
3. **A/B Testing**: Allow testing different prompt templates for the same form
4. **Conversion Tracking**: Track which leads converted after receiving Agent Email messages
5. **Multi-step Form Support**: Handle multi-step forms and wizard-style lead capture

## Conclusion

This JavaScript integration approach provides a low-friction way for customers to integrate Agent Email with their existing forms without modifying their backend code. By supporting multiple form identification methods and flexible field mapping, we can accommodate a wide range of customer websites and form structures.

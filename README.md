# Mockup Showcase

Framework to develop functionalities and interfaces to be presented

### Getting Started

Simply clone the project, it does not need any server.
Create a config.json file:
```
    cp config.json.dist config.json
```
You are ready!

### Creating a new view

Create an html file with the template of the desired view (in /templates).
Example - /templates/newsection.html:

```
<script type = "text/template" id = "newsection-template">
    <div class = "newsection-content">
        <div class = "content">
            <div class = "page-header">
                <h1> <% = data.title%> </ h1>
                ...
        </div>
    </div>
    <br /> <br />
    <div class="breadcrumb centered"><a data-page="home" class="openpage" href="#"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>Back</a></div>
</script>
```

To provide the data template just create the corresponding structure json (in the /json), using the same template name.
Example - /json/newsection.json:

```
{
  "Title": "New Section"
}
```

The application logic is inserted into js /my-app.js, creating a special function in the "app":

```
...
    newsectionpage: function(data) {
        // Logic, events and more. "Data" is the json object for this view
    },
...
```

The time must be added the call to the function under "opensection":

```
...
    }else if(name == 'newsection') {
        self.newsectionpage(data);
    }
...
```

Finally, it should be added in config.json file the object for the new view created:

```
...
    {
        "Label": "New View",
        "DataPage": "newsection"
    }
...
```

## Future developments

* Automation of the data structure, creating a new view.
* Logical separation from common custom logic in /js/my-app.js

## Built With

* [Bootstrap] (https://getbootstrap.com/) - A sleek, intuitive, and powerful the mobile first front-end framework for faster and easier web development.
* [ContactLab Pattern Library] (https://ux.contactlab.com/) - Open source UI components and visual style guide to create consistency and beautiful user experiences.

## Authors

* **Giorgio Arcella** - * ContactLab Mockup Showcase * - [github.com/giorgioarcella](https://github.com/giorgioarcella)
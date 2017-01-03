# Contactlab Mockup Showcase

Framework per sviluppare funzionalità e interfacce da presentare

### Come iniziare

E' sufficiente clonare il progetto, non serve alcun server.

### Creare una nuova vista

Creare un file html con il template della vista desiderata (sotto /templates). Esempio - /templates/newsection.html:

```
<script type="text/template" id="newsection-template">
    <div class="newsection-content">
        <div class="content">
            <div class="page-header">
                <h1><%= data.title %></h1>
                ...
        </div>
    </div>
    <br /><br />
    <div class="breadcrumb centered"><a data-page="home" class="openpage" href="#"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>Back</a></div>
</script>
```

Per fornire al template dei dati basta creare la corrispondente struttura json (nella cartella /json), utilizzando lo stesso nome del template. Esempio - /json/newsection.json:

```
{
  "title" : "New Section"
}
```

La logica dell'applicazione va inserita in js/my-app.js, creando una funzione apposita nell'oggetto "app":

```
...
    newsectionpage: function(data){
        //Logic, events and more. "data" is the json object for this view
    },
...
```

Ll momento, va aggiunta anche la chiamata alla funzione sotto "opensection":

```
...
    }else if(name == 'newsection'){
        self.newsectionpage(data);
    }
...
```

Infine, va aggiunto nel file config.json l'oggetto relativo alla nuova vista creata:

```
...
    {
        "label" : "Nuova vista",
        "datapage" : "newsection"
      }
...
```

## Sviluppi futuri

Automatizzazione della creazione della struttura dati di una nuova vista.

## Built With

* [Backbone](http://backbonejs.org/) - MVC framework
* [Bootstrap](https://getbootstrap.com/) - A sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development

## Authors

* **Giorgio Arcella** - *Contactlab Mockup Showcase* - [github.com/giorgioarcella](https://github.com/giorgioarcella)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


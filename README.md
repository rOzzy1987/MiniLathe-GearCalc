
# Mini Lathe Change Gear Calculator
This project is an attempt to have a phone friendly tool in your pocket when standing next to your lathe having to cut a specific thread that isn't printed on your factory gear table.

I'd be happy to get feature requests, improvement ideas, but please keep in mind that this is a weekend project of mine. If you're a developer and can work your way through the code, fix what you want, and create a pull request.

## Live web app
You can use this tool as-is on the following link:
[Mini Lathe Change Gear Calculator](https://gearcalc.netlify.app)

## Usage 
### General
There are a few features that are important to mention:

- On each page that contains a datagrid with gear setups you'll find an illustration of your mini lathe geartrain. This is not 100% precise, but you can see what the selected setup should look like, if there are any gears colliding with smething.
- On each data grid 
	- you can set a gear setup as favorite so you don't have to find it again each timeyou need it
	- you can print the data grid as a standalone document
	- you can export the datagrid into a csv file and use it as you wish.   

### First steps
First thing to do when starting to use this app is to check the configuration tab. The most important settings to check are as follows:

- Check your leadscrew pitch and set it up correctly. If you don't know for sure, you can just use the built in wizard to suggest you a value.
- Check the distance between your driven and leadscrew axles in millimeters. The app checks if the selected gears are big enough to reach each other on the lathe or not.
- Check your gear collection. I tried to get some info about what set of gears are shipped with most lathes, but yours may differ.

### Pitch Table tab
On this tab you can find the most common thread sizes and one of the most precise gear set for its pitch based on your lathe and gears. I'm a metric guy, so I can't really guarantee the validity of the data for imperial threads.
### Gears for pitch tab
As the name suggests, you select a pitch, the app suggest you some gears to achieve it.

### Pitch for gears tab
The exact opposite of the previous one.
You can searchfor a Hypothetical or real gear combination and see what pitch it will result in.
You also get suggestions using your gear set to achieve a similar pitch.
If you just want to search for a partial match, there's a third data grid just for that purpose.
### Favorites tab
As the name suggests, here you'll find the gear setups you marked as favorite. Print them to stick on your lathe, export them to use otherwise, or just look at this page when you're in the shop working on the lathe. 


## Development Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

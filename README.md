# Superhero Villain Database

You are a villain, and your goal is to gather intel on superheroes! This web page helps you organize all the secret data on them.

## Features

- **Fetch Superhero Data**: Loads data from an external JSON source.
- **Display in Table**: Shows key information in a structured format.
- **Pagination**: Allows navigation through pages with selectable page sizes (10, 20, 50, 100, or all).
- **Search**: Filters results dynamically as you type.
- **Sorting**: Click on any column to sort alphabetically or numerically.
- **Hero Pages**: Each superhero has their own page with more detailed information.

## Data Source

Data is fetched from:  
`https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json`

## Displayed Fields

- **Icon** (small image)
- **Name**
- **Full Name**
- **Powerstats** (intelligence, strength, speed, etc.)
- **Race**
- **Gender**
- **Height**
- **Weight**
- **Place of Birth**
- **Alignment** (hero/villain)

 ## Usage

1. Clone the repository.    
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project folder:
    ```bash
    cd <project-folder>
    ```
3. Start a local server using Python3:

   ```bash
   python3 -m http.server
   ```

4. Open your browser and go to:  
   [http://localhost:8000](http://localhost:8000)


## Technical Details

- **No frameworks**: Built using plain HTML, CSS, and JavaScript.
- **Fast performance**: Optimized for speed and interactivity.
- **Sorting behavior**:
  - Defaults to sorting by **Name (ascending)**.
  - Clicking a column toggles between ascending and descending order.
  - Missing values always appear last.

## Miscellaneous

Made for villains who need organized superhero data. 🦹‍♂️


## Authors
- [Roope Hongisto](https://github.com/RuBoMa)
- [Richard Aung Khant Min](https://github.com/)
- [Markus Amberla](https://github.com/MarkusYPA)

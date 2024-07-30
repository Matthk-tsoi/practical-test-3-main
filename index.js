function movieApp() {
  return {
    movies: [],
    loading: true,
    error: false,
    page: 1,
    sortOrder: "desc",
    activeSection: "",
    isOpen: false,
    init() {
      AOS.init();
      this.fetchMovies();
      this.setupIntersectionObserver();
    },
    fetchMovies() {
      this.loading = true;
      this.error = false;
      fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${this.page}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTkwNDIzNDY3ODZhOTIxY2E3MzJmZmM0YzAxYTIxZiIsIm5iZiI6MTcyMTgwNzc3MC40NTAyNzcsInN1YiI6IjY2YTBhN2VhZjdhMTE0YTA4M2UwZDRhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SQjgB9waWCim1CPQFSbrHehebcAcr4uDQV8iIYgIrps",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(
                `Error ${response.status}: ${err.status_message}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          if (!data.results) {
            throw new Error("Invalid response structure");
          }
          console.log(data.results);
          this.movies = data.results;
          this.sortMovies();
          this.loading = false;
        })
        .catch((error) => {
          this.error = true;
          this.loading = false;
          console.error("Error fetching popular movies:", error);
          alert(`Error fetching popular movies: ${error.message}`);
        });
    },
    sortMovies() {
      if (this.sortOrder === "desc") {
        this.movies.sort((a, b) => b.popularity - a.popularity);
      } else {
        this.movies.sort((a, b) => a.popularity - b.popularity);
      }
    },
    sortByPopularity() {
      this.sortOrder = this.sortOrder === "desc" ? "asc" : "desc";
      this.sortMovies();
    },
    setupIntersectionObserver() {
      const sections = document.querySelectorAll("section");
      const options = {
        root: null,
        rootMargin: "-115px 0px",
        threshold: 0.7,
      };

      const callback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      };

      const observer = new IntersectionObserver(callback, options);

      sections.forEach((section) => {
        observer.observe(section);
      });
    },
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        this.activeSection = sectionId;
      }
    },
    toggleMobileMenu() {
      this.isOpen = !this.isOpen;
    },
    prevPage() {
      this.movies = "";
      if (this.page > 1) {
        this.page--;
        this.fetchMovies();
      }
    },
    nextPage() {
      this.movies = "";
      this.page++;
      this.fetchMovies();
    },
  };
}

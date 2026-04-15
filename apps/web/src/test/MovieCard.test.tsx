import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const mockMovie = {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    vote_average: 8.4,
    release_date: "1999-10-15",
    media_type: "movie",
};

const renderCard = (movie = mockMovie) =>
    render(<MemoryRouter><MovieCard movie={movie} /></MemoryRouter>);

describe("MovieCard — rendu", () => {
    it("affiche le titre du film", () => {
        renderCard();
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
    });

    it("affiche l'année de sortie", () => {
        renderCard();
        expect(screen.getByText("1999")).toBeInTheDocument();
    });

    it("génère un lien vers la page film avec le bon type", () => {
        renderCard();
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/movie/550?type=movie");
    });

    it("affiche l'affiche si poster_path est fourni", () => {
        renderCard();
        const img = screen.getByAltText("Fight Club");
        expect(img).toBeInTheDocument();
        expect(img.getAttribute("src")).toContain("pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg");
    });

    it("affiche la première lettre du titre si pas d'affiche", () => {
        renderCard({ ...mockMovie, poster_path: "" });
        expect(screen.getByText("F")).toBeInTheDocument();
    });

    it("utilise 'name' si 'title' absent (série TV)", () => {
        renderCard({ ...mockMovie, title: undefined as any, name: "Breaking Bad", media_type: "tv" } as any);
        expect(screen.getByText("Breaking Bad")).toBeInTheDocument();
    });

    it("génère un lien /type=tv pour une série", () => {
        render(<MemoryRouter><MovieCard movie={{ ...mockMovie, media_type: "tv" }} /></MemoryRouter>);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/movie/550?type=tv");
    });
});

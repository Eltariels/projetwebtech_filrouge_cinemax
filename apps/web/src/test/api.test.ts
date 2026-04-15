import { describe, it, expect } from "vitest";
import { api } from "../lib/api";

describe("api — fonctions TMDB", () => {
    it("expose getTrending", () => expect(typeof api.getTrending).toBe("function"));
    it("expose getPopularMovies", () => expect(typeof api.getPopularMovies).toBe("function"));
    it("expose getTopRated", () => expect(typeof api.getTopRated).toBe("function"));
    it("expose getMovie", () => expect(typeof api.getMovie).toBe("function"));
    it("expose getTv", () => expect(typeof api.getTv).toBe("function"));
    it("expose search", () => expect(typeof api.search).toBe("function"));
    it("expose discover", () => expect(typeof api.discover).toBe("function"));
    it("expose discoverFiltered", () => expect(typeof api.discoverFiltered).toBe("function"));
});

describe("api — fonctions authentifiées", () => {
    it("expose getWatchlist", () => expect(typeof api.getWatchlist).toBe("function"));
    it("expose addToWatchlist", () => expect(typeof api.addToWatchlist).toBe("function"));
    it("expose removeFromWatchlist", () => expect(typeof api.removeFromWatchlist).toBe("function"));
    it("expose getRatings", () => expect(typeof api.getRatings).toBe("function"));
    it("expose getRating", () => expect(typeof api.getRating).toBe("function"));
    it("expose saveRating", () => expect(typeof api.saveRating).toBe("function"));
    it("expose deleteRating", () => expect(typeof api.deleteRating).toBe("function"));
    it("expose savePreferences", () => expect(typeof api.savePreferences).toBe("function"));
    it("expose getHistory", () => expect(typeof api.getHistory).toBe("function"));
    it("expose addToHistory", () => expect(typeof api.addToHistory).toBe("function"));
    it("expose clearHistory", () => expect(typeof api.clearHistory).toBe("function"));
});

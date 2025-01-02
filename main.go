package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"runtime"
	"sort"
	"strconv"
)

type Player struct {
	Name  any `json:"name"`
	Rank  any `json:"rank"`
	Score int `json:"score"`
	Time  any `json:"time"`
}

var Players = []Player{}

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/api/save_score", save_score)
	http.HandleFunc("/api/get_rank", get_rank)
	http.HandleFunc("/api/number_pages", number_pages)
	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		http.Error(w, "Failed to parse template: "+err.Error(), http.StatusInternalServerError)
		printDebugInfo(err)
		return
	}

	err = tmpl.Execute(w, nil)
	if err != nil {
		http.Error(w, "Failed to execute template: "+err.Error(), http.StatusInternalServerError)
		printDebugInfo(err)
		return
	}
}

func SortAndUpdateRank(players []Player) {
	// Sort the players by score in descending order
	sort.Slice(players, func(i, j int) bool {
		return players[i].Score > players[j].Score
	})

	// Update the rank based on the sorted order
	for i := range players {
		players[i].Rank = i + 1
	}
}

func save_score(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	var Player Player
	err := json.NewDecoder(r.Body).Decode(&Player)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, "internal server error")
		printDebugInfo(err)
		return
	}
	Players = append(Players, Player)
	SortAndUpdateRank(Players)
	defer r.Body.Close()

}

func number_pages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	jsonResponse(w, http.StatusOK, (len(Players)/5)+1)

}

func get_rank(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	page, _ := strconv.Atoi(r.FormValue("page"))
	if page < 1 {
		jsonResponse(w, http.StatusBadRequest, "bad request")
		return
	}
	var res []Player
	for i := (page * 5) - 5; i < len(Players) && i < (page*5); i++ {
		res = append(res, Players[i])
	}
	jsonResponse(w, http.StatusOK, res)
	res = res[:0]

}

func jsonResponse(w http.ResponseWriter, status int, message any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(message)
	if err != nil {
		fmt.Println("ERROR ENCODE DATA : ", err)
		printDebugInfo(err)
		return
	}
}

func printDebugInfo(err any) {

	_, file, line, ok := runtime.Caller(1)
	// the number 1 in a int parameter that idicate how man call stack i have to
	//skip to riche the line that i want

	// file : is the file name of the line that i want
	// line : is the line number of the line that i want
	// ok   : is bool that indicate if runtime.Caller(1) worked correctly
	if !ok {
		fmt.Println("Could not get caller information")
		return
	}

	// Print the file name and the line number
	fmt.Printf("Debug Info - File: %s, Line: %d\nwith the following error:\n%v", file, line, err)
}

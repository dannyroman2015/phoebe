package app

import (
	"log"
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"
)

// ////////////////////////////////////////////////////////////////////////////
//
//	withAuth - middleware check authentication by look at "authrls" cookie
//
// ////////////////////////////////////////////////////////////////////////////
func withAuth(h httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		authurlsToken, err := r.Cookie("authurls")
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		if !strings.Contains(authurlsToken.Value, r.URL.Path) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized) // should design a page for unauthorized request
			return
		}
		h(w, r, ps)
	}
}

// ////////////////////////////////////////////////////////////////////////////
//
//	withAuth2 - middleware check authentication by look at "authrls" cookie
//
// ////////////////////////////////////////////////////////////////////////////
func withAuth2(h httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		authurlsToken, err := r.Cookie("authurls")
		if err != nil {
			log.Println(err)
			w.Write([]byte("Not log in yet"))
			return
		}

		if !strings.Contains(authurlsToken.Value, r.URL.Path) {
			w.Write([]byte("không có thẩm quyền"))
			return
		}
		h(w, r, ps)
	}
}

// wrap a handler or middleware that return a handler
func wrapper(handler http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		handler.ServeHTTP(w, r)
	}
}

// sample for httprouter middleware
func middleware(n httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		log.Println("middleware")
		n(w, r, ps)
	}
}

func BasicAuth(h httprouter.Handle, requiredUser, requiredPassword string) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		group := []map[string]string{
			{"trung": "123"},
			{"hai": "456"},
		}
		user, password, hasAuth := r.BasicAuth()
		isOk := false
		for _, g := range group {
			for k, v := range g {
				if user == k && password == v {
					isOk = true
					break
				}
			}
		}
		if hasAuth && isOk {
			h(w, r, ps)
		} else {
			w.Header().Set("WWW-Authenticate", "Basic realm=Restricted")
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		}

		// if hasAuth && user == requiredUser && password == requiredPassword {
		// 	h(w, r, ps)
		// } else {
		// 	w.Header().Set("WWW-Authenticate", "Basic realm=Restricted")
		// 	http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		// }
	}
}

package main

import (
	"path"
	"strings"

	// "encoding/xml"
	"fmt"
	"io/ioutil"
	"os"

	// "sync"

	"github.com/JoshVarga/svgparser"
	"github.com/evanw/esbuild/pkg/api"
)

type TSX struct {
}

// Plugin can be used in api.BuildOptions.
func (ex *TSX) Plugin(plugin api.Plugin) {
	plugin.SetName("TSX")
	plugin.AddLoader(
		api.LoaderOptions{Filter: `\.(tsx|jsx)$`},
		func(args api.LoaderArgs) (res api.LoaderResult, err error) {
			dat, err := ioutil.ReadFile(args.Path)
			if err != nil {
				return res, err
			}
			contents := fmt.Sprintf("%s\n%s", "import {jsx} from 'h'", string(dat))
			res.Contents = &contents
			res.Loader = api.LoaderTSX
			return res, nil
		},
	)
}

func svgToJsx(items []*svgparser.Element) string {
	res := ""
	for _, el := range items {
		str := fmt.Sprintf("<%s %s>%s</%s>", el.Name, attributesToString(el.Attributes), svgToJsx(el.Children), el.Name)
		res += str
	}
	return res
}

func attributesToString(attr map[string]string) string {
	res := ""
	for key, val := range attr {
		str := fmt.Sprintf(`%s="%s"`, key, val)
		res += str
	}
	return res
}

type SVGR struct {
}

// Plugin can be used in api.BuildOptions.
func (ex *SVGR) Plugin(plugin api.Plugin) {
	plugin.SetName("SVGR")
	plugin.AddResolver(api.ResolverOptions{Filter: "^svgr:"}, func(args api.ResolverArgs) (res api.ResolverResult, err error) {
		res.Path = path.Join(path.Dir(args.Importer), strings.TrimLeft(args.Path, "svgr:"))
		res.Namespace = "svg"
		return res, nil
	})
	plugin.AddLoader(
		api.LoaderOptions{Filter: `\.svg`, Namespace: "svg"},
		func(args api.LoaderArgs) (res api.LoaderResult, err error) {
			dat, err := os.Open(args.Path)
			if err != nil {
				return res, err
			}

			svg, err := svgparser.Parse(dat, true)
			if err != nil {
				return res, err
			}
			contents := fmt.Sprintf(`
      import React from "react";
      import url from "%s"
      export default url;
      export function ReactComponent(props) {
        return <svg %s {...props}>
        %s
        </svg>
      }
      `, args.Path, attributesToString(svg.Attributes), svgToJsx(svg.Children))
			res.Contents = &contents
			res.Loader = api.LoaderTSX
			res.ResolveDir = path.Dir(args.Path)
			return res, nil
		},
	)
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	// cssExtractor := CSSExtractor{}
	svgrPlugin := SVGR{}

	result := api.Build(api.BuildOptions{
		// EntryPoints: []string{"../src/assets/icons/internal.tsx"},
		EntryPoints: []string{"../src/entry.tsx"},
		Defines: map[string]string{
			"process.env.NODE_ENV":          "'development'",
			"process.env.REACT_APP_VERSION": "'{}'",
			"global":                        "window",
		},
		Loaders: map[string]api.Loader{
			".svg": api.LoaderBase64,
		},
		Externals: []string{
			// "assets/styles",
			// "assets/icons/internal",
			// "assets/images",
			// todo, check if we want to go with webpack for parsing the whole app
			// "react"
		},
		// MinifySyntax:      true,
		// MinifyIdentifiers: true,
		// MinifyWhitespace:  true,
		Target:            api.ES2019,
		Bundle:            true,
		Metafile:          "./meta",
		Write:             true,
		Splitting:         false,
		Format:            api.FormatESModule,
		LogLevel:          api.LogLevelInfo,
		Outdir:            "../es_dist",
		Plugins: []func(api.Plugin){
			svgrPlugin.Plugin,
		},
	})

	// err := ioutil.WriteFile("../dist/test.css", cssExtractor.Bytes(), 0644)
	// check(err)

	if len(result.Errors) > 0 {
		os.Exit(1)
	}
}

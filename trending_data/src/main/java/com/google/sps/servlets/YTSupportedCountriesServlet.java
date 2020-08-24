package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/yt-supported-countries")
public class YTSupportedCountriesServlet extends HttpServlet {

  /** This variable is empty upon class instantion */
  private ArrayList<String> ytSupportedCountries = new ArrayList<>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    if (ytSupportedCountries.isEmpty()) {
      /**
       * if this is the first request, fetch the supported countries this will only occur once,
       * after the servlet is instantiated
       */
      ytSupportedCountries =
          YTSupportedCountriesSearch.getSupportedCountries(); // codes of countries supported by YT
    }

    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(ytSupportedCountries));
  }
}

package com.google.sps.data;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/**
 * Class to test that parsing of country file is correct. The file is in TSV format and each country
 * has six corresponding fields. Also test that a Country object is constructed correctly, i.e. all
 * the fields take appropriate values.
 */
@RunWith(JUnit4.class)
public final class CountryTest {
  private static final String EMPTY_STRING = "";
  private static final String INIT = "\tCountry\tCO\tCOU\t0\t0\t0";
  /** Use this to construct a Country() object */
  private static final String ALBANIA = "Albania\tAL\tALB\t8\t41\t20";

  private static final String[] ALBANIA_ARRAY = {"Albania", "AL", "ALB", "8", "41", "20"};

  private static final String AL_NAME = "Albania";
  private static final String AL_ALPHA2 = "AL";
  private static final double AL_LAT = 41;
  private static final double AL_LNG = 20;

  /** Use this for floating point comparison. Math.abs( expected – actual ) <= delta */
  private static final double delta = 0.001;

  private static final int CORRECT_NUMBER_OF_FIELDS = 6;

  private Country parser;

  @Before
  public void setUp() {
    parser = new Country(INIT);
  }

  @Test
  public void parseTSVIntoCorrectFields() {
    /** Checks that for a tab-separated string, the correct fields are returned */
    String[] parsingResult = parser.parse(ALBANIA);
    Assert.assertEquals(ALBANIA_ARRAY, parsingResult);
  }

  @Test
  public void constructCountryWithCorrectFields() {
    /**
     * Checks that Country constructor initializes the appropriate fields correctly, i.e. name,
     * alpha 2 code, latitude, longitude
     */
    Country albania = new Country(ALBANIA);

    Assert.assertEquals(AL_NAME, albania.getName());
    Assert.assertEquals(AL_ALPHA2, albania.getAlpha2Code());
    Assert.assertEquals(AL_LAT, albania.getLat(), delta); // floating point
    Assert.assertEquals(AL_LNG, albania.getLng(), delta); // comparison
  }

  @Test(expected = IllegalArgumentException.class)
  public void throwsExceptionWhenEmptyString() {
    /**
     * Checks that an IllegalArgumentException is thrown if the parsing of an empty string is
     * attempted
     */
    String[] parsingResult = parser.parse(EMPTY_STRING);
  }

  @Test
  public void parseTSVIntoCorrectNumberOfFields() {
    /** Checks that for a tab-separated string, the correct number of fields are returned */
    String[] parsingResult = parser.parse(ALBANIA);
    Assert.assertEquals(CORRECT_NUMBER_OF_FIELDS, parsingResult.length);
  }
}

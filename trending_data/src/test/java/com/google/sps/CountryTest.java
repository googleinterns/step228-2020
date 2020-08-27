package com.google.sps.data;

import org.junit.Assert;
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
  private static final String ALBANIA_TSV_ROW = "Albania\tAL\tALB\t8\t41\t20\t23424742";

  private static final String[] ALBANIA_ARRAY = {"Albania", "AL", "ALB", "8", "41", "20", "23424742"};

  private static final String AL_NAME = "Albania";
  private static final String AL_ALPHA2 = "AL";
  private static final double AL_LAT = 41;
  private static final double AL_LNG = 20;
  private static final long AL_WOEID = 23424742;

  /** Use this for floating point comparison. Math.abs( expected – actual ) <= delta */
  private static final double delta = 0.001;

  private static final int CORRECT_NUMBER_OF_FIELDS = 7;

  @Test
  public void parseTSVIntoCorrectFields() {
    /** Checks that for a tab-separated string, the correct fields are returned */
    String[] parsingResult = Country.parse(ALBANIA_TSV_ROW);
    Assert.assertEquals(ALBANIA_ARRAY, parsingResult);
  }

  @Test
  public void constructCountryWithCorrectFields() {
    /**
     * Checks that Country constructor initializes the appropriate fields correctly, i.e. name,
     * alpha 2 code, latitude, longitude
     */
    Country albania = new Country(ALBANIA_TSV_ROW);

    Assert.assertEquals(AL_NAME, albania.getName());
    Assert.assertEquals(AL_ALPHA2, albania.getAlpha2Code());
    Assert.assertEquals(AL_LAT, albania.getLat(), delta); // floating point
    Assert.assertEquals(AL_LNG, albania.getLng(), delta); // comparison
    Assert.assertEquals(AL_WOEID, albania.getWoeid());
  }

  @Test(expected = IllegalArgumentException.class)
  public void throwsExceptionWhenEmptyString() {
    /**
     * Checks that an IllegalArgumentException is thrown if the parsing of an empty string is
     * attempted
     */
    String[] parsingResult = Country.parse(EMPTY_STRING);
  }

  @Test
  public void parseTSVIntoCorrectNumberOfFields() {
    /** Checks that for a tab-separated string, the correct number of fields are returned */
    String[] parsingResult = Country.parse(ALBANIA_TSV_ROW);
    Assert.assertEquals(CORRECT_NUMBER_OF_FIELDS, parsingResult.length);
  }
}

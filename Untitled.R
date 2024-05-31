# Install devtools if not already installed
setwd("/Developer")
if (!requireNamespace("devtools", quietly = TRUE))
  install.packages("devtools")

if (!require("drat")) {
  install.packages("drat")
  library("drat")
}
drat::addRepo("kjhealy")
install.packages("ukelection2019")
install.packages("tidyverse")
library(tidyverse)
library(ukelection2019)
# Load the data
data("ukelection2019")
# Write the data to a CSV file
write_csv(ukelection2019, "uk_election_2019_results.csv")


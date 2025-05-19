async function loadData() {
  try {
    const quoteData = await fetchDailyQuote();
    // Use the data
  } catch (error) {
    console.error('Failed to load quote:', error);
    // Handle the error appropriately
  }
}
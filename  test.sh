#!/bin/bash

# Test script for Caching Proxy Server

echo "🧪 Testing Caching Proxy Server..."
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: First request (should be MISS)
echo -e "${YELLOW}Test 1: First request to /products${NC}"
RESPONSE1=$(curl -s -i http://localhost:3000/products)
CACHE_STATUS1=$(echo "$RESPONSE1" | grep -i "X-Cache:" | awk '{print $2}')
echo "Cache Status: $CACHE_STATUS1"
if [[ "$CACHE_STATUS1" == *"MISS"* ]]; then
    echo -e "${GREEN}✓ PASS - Cache MISS as expected${NC}"
else
    echo "✗ FAIL - Expected MISS"
fi
echo ""

# Wait a moment
sleep 1

# Test 2: Second request (should be HIT)
echo -e "${YELLOW}Test 2: Second request to /products${NC}"
RESPONSE2=$(curl -s -i http://localhost:3000/products)
CACHE_STATUS2=$(echo "$RESPONSE2" | grep -i "X-Cache:" | awk '{print $2}')
echo "Cache Status: $CACHE_STATUS2"
if [[ "$CACHE_STATUS2" == *"HIT"* ]]; then
    echo -e "${GREEN}✓ PASS - Cache HIT as expected${NC}"
else
    echo "✗ FAIL - Expected HIT"
fi
echo ""

# Test 3: Different endpoint (should be MISS)
echo -e "${YELLOW}Test 3: Request to /products/1${NC}"
RESPONSE3=$(curl -s -i http://localhost:3000/products/1)
CACHE_STATUS3=$(echo "$RESPONSE3" | grep -i "X-Cache:" | awk '{print $2}')
echo "Cache Status: $CACHE_STATUS3"
if [[ "$CACHE_STATUS3" == *"MISS"* ]]; then
    echo -e "${GREEN}✓ PASS - Cache MISS for new endpoint${NC}"
else
    echo "✗ FAIL - Expected MISS"
fi
echo ""

# Test 4: Same endpoint again (should be HIT)
echo -e "${YELLOW}Test 4: Second request to /products/1${NC}"
RESPONSE4=$(curl -s -i http://localhost:3000/products/1)
CACHE_STATUS4=$(echo "$RESPONSE4" | grep -i "X-Cache:" | awk '{print $2}')
echo "Cache Status: $CACHE_STATUS4"
if [[ "$CACHE_STATUS4" == *"HIT"* ]]; then
    echo -e "${GREEN}✓ PASS - Cache HIT for repeated request${NC}"
else
    echo "✗ FAIL - Expected HIT"
fi
echo ""

echo "🎉 Tests completed!"
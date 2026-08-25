#!/bin/bash
source .env.local

# 1. Get Access Token
TOKEN_RES=$(curl -s -X POST "https://$NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN/admin/oauth/access_token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$SHOPIFY_ADMIN_CLIENT_ID&client_secret=$SHOPIFY_ADMIN_CLIENT_SECRET")

TOKEN=$(echo $TOKEN_RES | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo "Failed to get token: $TOKEN_RES"
  exit 1
fi
echo "Got token."

# 2. Create Unsubscribed Customer
QUERY='mutation { customerCreate(input: { email: "test_unsub@example.com", emailMarketingConsent: { marketingState: UNSUBSCRIBED } }) { customer { id email emailMarketingConsent { marketingState } } userErrors { field message } } }'

curl -s -X POST "https://$NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN/admin/api/$SHOPIFY_ADMIN_API_VERSION/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -d "{\"query\": \"$QUERY\"}"

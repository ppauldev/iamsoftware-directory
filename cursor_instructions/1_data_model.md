# Models

## Taxonomy

The Taxonomy model provides classification and organizational structure for content with the following components:

### Taxonomies

**group** (`#group`)
- Type: Group
- Relationship Type: Multiple values, One-way reference
- Description: Allows content to be organized into broad groupings or sections.

**category** (`#category`)
- Type: Category
- Relationship Type: Multiple values, One-way reference
- Description: Provides topic-based classification for content organization.

**tag** (`#tag`)
- Type: Tag
- Relationship Type: Multiple values, One-way reference
- Description: Offers more granular and flexible content labeling.

### Notes for Implementation

- Each taxonomy type (group, category, tag) represents a progressively more granular way to classify content.
- The one-way reference design means content can reference taxonomies, but taxonomies don't automatically reference back to content.
- Consider implementing hierarchical relationships within categories for more complex classification needs.
- Tags typically work best as a flat structure for flexible content discovery.

## Group

The Group model serves as a high-level organizational structure for content with the following attributes:

### Fields

**name** (`#name`)
- Type: String (Single line text)
- Constraints: Required, Title
- Description: The display name of the group. Serves as the primary identifier.

**description** (`#description`)
- Type: String (Multi line text)
- Description: Extended information about the group's purpose and content.

**slug** (`#slug`)
- Type: String (Slug)
- Constraints: Required, Unique
- Description: URL-friendly version of the name. Used for creating clean URLs for group pages.

### Relationships

**category** (`#category`)
- Type: Category
- Relationship Type: Multiple values, Two-way reference
- Description: Categories associated with this group. The relationship is bidirectional, meaning categories can also reference groups.

### Notes for Implementation

- The `name` field serves as both a required field and the main identifier for the group.
- Consider implementing automatic slug generation from the name with manual override capability.
- The bidirectional relationship with categories creates a hierarchical taxonomy structure.
- Groups typically represent the broadest level of content organization in the system.

## Category

The Category model provides a mid-level classification system for content with the following attributes:

### Fields

**name** (`#name`)
- Type: String (Single line text)
- Constraints: Required, Title
- Description: The display name of the category. Serves as the primary identifier.

**description** (`#description`)
- Type: String (Multi line text)
- Description: Extended information about the category's purpose and scope.

**slug** (`#slug`)
- Type: String (Slug)
- Constraints: Required, Unique
- Description: URL-friendly version of the name. Used for creating clean URLs for category pages.

### Relationships

**group** (`#group`)
- Type: Group
- Relationship Type: Two-way reference
- Description: The parent group this category belongs to. The relationship is bidirectional.

**tag** (`#tag`)
- Type: Tag
- Relationship Type: Multiple values, Two-way reference
- Description: Tags associated with this category. The relationship is bidirectional, allowing navigation between categories and their related tags.

### Notes for Implementation

- The `name` field serves as both a required field and the main identifier for the category.
- Categories exist in the middle of the taxonomy hierarchy, between groups and tags.
- The bidirectional relationships create a connected taxonomy structure that supports navigation in both directions.
- Consider implementing validation to ensure categories maintain consistent relationships with their parent groups.

## Tag

The Tag model provides the most granular level of content classification with the following attributes:

### Fields

**name** (`#name`)
- Type: String (Single line text)
- Constraints: Required, Title
- Description: The display name of the tag. Serves as the primary identifier.

**description** (`#description`)
- Type: String (Multi line text)
- Description: Extended information about the tag's purpose and scope.

**slug** (`#slug`)
- Type: String (Slug)
- Constraints: Required, Unique
- Description: URL-friendly version of the name. Used for creating clean URLs for tag pages.

### Relationships

**category** (`#category`)
- Type: Category
- Relationship Type: Two-way reference
- Description: The parent category this tag belongs to. The relationship is bidirectional.

### Notes for Implementation

- The `name` field serves as both a required field and the main identifier for the tag.
- Tags represent the most specific level in the taxonomy hierarchy.
- Consider implementing auto-suggestions for tags based on content analysis to maintain tag consistency.
- The bidirectional relationship with categories enables effective filtering and navigation between related content.

## Company

The Company model represents software vendors or organizations with the following structure:

### Fields

**name** (`#name`)
- Type: String (Single line text)
- Constraints: Required, Unique, Title
- Description: The official name of the company. Serves as the primary identifier.

**description** (`#description`)
- Type: String (Multi line text)
- Description: Detailed information about the company's background, products, and services.

**url** (`#url`)
- Type: String (Single line text)
- Description: The company's official website URL.

**slug** (`#slug`)
- Type: String (Slug)
- Constraints: Required, Unique
- Description: URL-friendly version of the company name. Used for creating clean URLs.

**rating** (`#rating`)
- Type: Float
- Description: Numerical rating or score assigned to the company.

**features** (`#features`)
- Type: String (Single line text)
- Constraints: Multiple values
- Description: List of key features or capabilities offered by the company's products.

**license** (`#license`)
- Type: String (Single line text)
- Description: Licensing model used by the company's products.

**pricingModel** (`#pricingModel`)
- Type: String (Single line text)
- Description: Description of the overall pricing approach (e.g., subscription, one-time, freemium).

**pricingDetails** (`#pricingDetails`)
- Type: String (Single line text)
- Description: Specific pricing information including tiers and costs.

**productDocs** (`#productDocs`)
- Type: String (Single line text)
- Description: URL or reference to the company's product documentation.

**developerDocs** (`#developerDocs`)
- Type: String (Single line text)
- Description: URL or reference to the company's technical documentation for developers.

### Relationships

**categories** (`#categories`)
- Type: Category
- Relationship Type: Multiple values, One-way reference
- Description: Categories associated with this company's products or services.

**topCategories** (`#topCategories`)
- Type: Category
- Relationship Type: Multiple values, One-way reference
- Description: Primary or featured categories that best represent the company's core offerings.

**tags** (`#tags`)
- Type: Tag
- Relationship Type: Multiple values, One-way reference
- Description: Specific tags for more granular classification of the company.

**categoryUrls** (`#categoryUrls`)
- Type: Basic (categoryUrl)
- Constraints: Multiple values
- Description: Custom landing page URLs for specific category pages related to this company.

**tagUrls** (`#tagUrls`)
- Type: Basic (tagUrl)
- Constraints: Multiple values
- Description: Custom landing page URLs for specific tag pages related to this company.

**companyTaxonomy** (`#companyTaxonomy`)
- Type: Basic (companyTaxonomy)
- Description: Custom taxonomy classification specific to this company.

**relatedPosts** (`#relatedPosts`)
- Type: Post
- Relationship Type: Multiple values, Two-way reference
- Description: Blog posts or articles that mention or review this company. The relationship is bidirectional.

### Notes for Implementation

- The `name` field serves as both a required field and the main identifier for the company.
- Consider implementing validation for the `url` field to ensure it contains a valid URL format.
- The separation between `categories` and `topCategories` allows for highlighting primary focus areas while maintaining comprehensive classification.
- The bidirectional relationship with posts enables content discovery from both directions - finding companies from posts and relevant content from company profiles.
- Custom URL fields (`categoryUrls`, `tagUrls`) can be used to create targeted landing pages that override default routing patterns.
- Consider implementing a versioning system for pricing information, as this data may change frequently.

## Post

The Post model represents the main content entity in the CMS with the following structure:

### Fields

**title** (`#title`)
- Type: String (Single line text)
- Constraints: Required, Unique, Title
- Description: The main title of the post. Used as the primary identifier.

**slug** (`#slug`)
- Type: String (Slug)
- Constraints: Required, Unique
- Description: URL-friendly version of the title. Used for creating clean URLs.

**date** (`#date`)
- Type: Date
- Description: Publication date of the post.

**author** (`#author`)
- Type: String (Single line text)
- Description: Name of the post author.

**excerpt** (`#excerpt`)
- Type: String (Multi line text)
- Description: Brief summary or introduction to the post content.

**keywords** (`#keywords`)
- Type: String (Single line text)
- Constraints: Multiple values
- Description: Tags or keywords associated with the post for categorization and search.

### Relationships

**relatedCompanies** (`#relatedCompanies`)
- Type: Company
- Relationship Type: Multiple values, Two-way reference
- Description: Companies associated with this post. The relationship is bidirectional, meaning companies can also reference posts.

**relatedContent** (`#relatedContent`)
- Type: Content
- Relationship Type: One-way reference
- Description: Other content pieces related to this post. This is a unidirectional relationship.

### Notes for Implementation

- The `title` field serves as both a required field and the main identifier for the post.
- The `slug` field should be automatically generated from the title but remain editable.
- The bidirectional relationship with `relatedCompanies` means updates may need to be synchronized in both directions.
- Consider implementing validation for the `slug` field to ensure URL compatibility.

## Content

The Content model represents reusable content blocks or pages with the following structure:

### Fields

**slug** (`#slug`)
- Type: String (Slug)
- Constraints: Required, Unique, Title
- Description: URL-friendly identifier for the content piece. Serves as the primary identifier.

**markdown** (`#markdown`)
- Type: String (Markdown)
- Description: The main content body in Markdown format, supporting rich text formatting including headers, lists, links, and other Markdown syntax.

### Notes for Implementation

- The `slug` field serves as both the primary identifier and the URL path component.
- Content pieces can be referenced by other models (like Post) using a one-way reference relationship.
- Consider implementing Markdown preview functionality in the editing interface.
- For performance optimization, consider storing both the raw Markdown and a pre-rendered HTML version.
- Ensure proper sanitization of Markdown content to prevent XSS vulnerabilities when rendering.

# Components

## categoryUrl

The categoryUrl component provides custom URL mapping for category pages with the following structure:

#### Fields

**url** (`#url`)
- Type: String (Single line text)
- Constraints: Required, Title
- Description: Custom URL path for a specific category when associated with a company.

#### Relationships

**category** (`#category`)
- Type: Category
- Relationship Type: One-way reference
- Description: The category that this custom URL is associated with.

#### Notes for Implementation

- This component enables creation of company-specific landing pages for categories.
- Implement URL validation to ensure paths are properly formatted and unique within a company context.
- Consider adding redirects from standard category URLs to these custom URLs when in the context of the associated company.
- URL generation should handle conflicts when multiple companies define custom URLs for the same category.

## tagUrl

The tagUrl component provides custom URL mapping for tag pages with the following structure:

#### Fields

**url** (`#url`)
- Type: String (Single line text)
- Constraints: Required, Title
- Description: Custom URL path for a specific tag when associated with a company.

#### Relationships

**tag** (`#tag`)
- Type: Tag
- Relationship Type: One-way reference
- Description: The tag that this custom URL is associated with.

#### Notes for Implementation

- This component enables creation of company-specific landing pages for tags.
- Similar to categoryUrl, implement URL validation to ensure paths are properly formatted and unique.
- Consider implementing consistent URL patterns between custom category and tag URLs to improve user experience.
- These custom tag URLs can be particularly useful for specialized product feature pages or targeted marketing campaigns.

## companyTaxonomy

The companyTaxonomy component provides customized taxonomy classification for specific companies with the following structure:

#### Relationships

**group** (`#group`)
- Type: Group
- Relationship Type: One-way reference
- Description: The primary group associated with this company's taxonomic classification.

**category** (`#category`)
- Type: Category
- Relationship Type: Multiple values, One-way reference
- Description: Categories that apply specifically to this company's taxonomy.

**tag** (`#tag`)
- Type: Tag
- Relationship Type: Multiple values, One-way reference
- Description: Tags that apply specifically to this company's taxonomy.

**relatedCompany** (`#relatedCompany`)
- Type: Company
- Relationship Type: One-way reference
- Description: Reference to another company that is related or comparable to the parent company.

#### Notes for Implementation

- This component allows for creation of company-specific taxonomy structures that may differ from the global taxonomy.
- Use this for capturing specialized industry classifications that may only apply to specific companies.
- The one-way reference to related companies enables comparison features without requiring mutual connection.
- Consider implementing an interface to easily visualize and manage these custom taxonomy relationships.
- When displaying company information, merge the standard taxonomy with this custom taxonomy for comprehensive representation.
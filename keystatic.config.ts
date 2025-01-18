import { config, collection, fields, component, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

export const markdocConfig = fields.markdoc.createMarkdocConfig({});

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'keystatic-testing/keystatic-blog',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'posts/*',
      format: { contentField: 'content', data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            link: true
          },
          components: {
            'youtube-video': block({
              label: 'Youtube Video',
              schema: {
                youtubeVideo: fields.text({
                  label: 'Youtube Video ID',
                  description: 'Enter the Youtube Video ID',
                  validation: {
                    length: {
                      min: 1,
                    }
                  }
                })
              }
            })
          }
        }),
        // author: fields.relationship({
        //   label: "Author",
        //   collection: 'authors'
        // }),
        authors: fields.array(
          fields.relationship({
            label: "Authors",
            collection: 'authors',
            validation: {
              isRequired: true
            }
          }),
          { label: 'Authors', itemLabel: (item) => item.value || 'Please select an author' }
        )
      },
    }),
    authors: collection({
      label: "Authors",
      slugField: 'name',
      path: 'authors/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        email: fields.text({ label: 'Email' }),
        avatar: fields.image({ label: 'Avatar', directory: 'public/images/avatars', publicPath: '/images/avatars' }),
        showcase: fields.blocks(
          {
            link: {
              label: 'Link',
              schema: fields.object({
                label: fields.text({
                  label: 'Label', validation: {
                    length: {
                      min: 1,
                    }
                  }
                }),
                url: fields.url({ label: 'URL' })
              }),
              itemLabel: (item) => 'Link:' + item.fields.label.value,
            },
            youtubeVideoId: {
              label: 'Youtube Video ID',
              schema: fields.text({
                label: 'Youtube Video ID', validation: {
                  length: {
                    min: 1,
                  }
                }
              }),
              itemLabel: (item) => 'Youtube Video ID:' + item?.value,
            }
          },
          { label: 'Social links' }
        )
      }
    }),
  },
  singletons: {
    socialLinks: singleton({
      label: 'Social Links',
      schema: {
        twitter: fields.text({ label: 'Twitter', description: 'Enter your Twitter handle' }),
        github: fields.text({ label: 'Github', description: 'Enter your Github username' }),
        linkedin: fields.text({ label: 'LinkedIn', description: 'Enter your LinkedIn username' }),
      }
    })
  }
});

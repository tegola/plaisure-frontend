export default {
	// Common -----------------------------------------------------------------
	common: {
		weekdays: {
			monday: 'Monday',
			tuesday: 'Tuesday',
			wednesday: 'Wednesday',
			thursday: 'Thursday',
			friday: 'Friday',
			saturday: 'Saturday',
			sunday: 'Sunday'
		},
		status: {
			error: 'Error',
			loading: 'Loading',
			offline: "Attention: you're not connected to the internet!",
			invalid_form: 'There are errors in the form. Please review your entry.',
			load_error: 'There was an error while loading data. Please try again.',
			save_error: 'There was an error while saving data. Please try again.'
		},
		actions: {
			add: 'Add',
			back: 'Indietro',
			cancel: 'Cancel',
			change: 'Change',
			close: 'Close',
			continue: 'Continue',
			delete: 'Delete',
			done: 'Done',
			edit: 'Edit',
			remove: 'Remove',
			save: 'Save',
			select: 'Select',
			sort: 'Sort',
			upload: 'Upload'
		},
		cookie: {
			agree: 'By using this website, you agree to our {policy_link}',
			link: 'cookie policy'
		}
	},

	// Components -------------------------------------------------------------
	components: {
		navbar: {
			home: 'Home',
			search: 'Search venues',
			login: 'Sign in',
			register: 'Register',
			promote: 'Promote your venue',
			company: 'Company & Contact',
			responsible: 'Responsible playing'
		},

		lightbox: {
			previous: 'Previous',
			next: 'Next',
			close: 'Close',
			counter: '{current} of {total}'
		},

		no_items: {
			title: 'No items found'
		},

		footer: {
			search: 'Search venues',
			promote: 'Promote your venue',
			about: 'About us',
			responsible_gaming: 'Play responsibly',
			copyright: 'Copyright {year} {company}',
			vat: 'VAT {number}'
		},

		venue_item: {
			highlight: {
				new: 'New!',
				open: 'Open now!'
			}
		},

		review_form: {
			title: 'Leave a review',
			rating: 'Rating',
			rating_error: 'Please pick a rating.',
			summary: 'Summary',
			summary_placeholder:
				'Summarize your visit or highlight an interesting detail',
			summary_error: 'Please type a summary for this review.',
			body: 'Review',
			body_placeholder:
				'Tell about your experience here. Service, atmosphere, hospitality?',
			body_error: 'Please write the review.',
			submit: 'Submit review',
			submit_success: 'Thanks for your feedback!'
		},

		review_item: {
			owner_response: 'Owner response',
			actions: {
				reply: 'Reply',
				edit_reply: 'Edit reply',
				report: 'Report',
				reported: 'Reported'
			},
			reply_form: {
				label: 'Reply to this review',
				post: 'Post',
				update: 'Update reply',
				delete: 'Delete reply'
			},
			report_dialog: {
				title: 'Report review',
				text:
					'Report this review as offensive, inappropriate, upsetting or spam?',
				submit: 'Submit report'
			}
		},

		subscription_card: {
			price: '{currency}{price}/month',
			highlight: 'Most popular',
			perks: {
				presence: 'Get more visibility for your business',
				details: 'Add photos, business hours and amenities',
				list: 'List your venue in the search results',
				as_free: 'All the perks of the free plan, plus:',
				distance_bonus: '{amount}% bonus in search results',
				home_page_presence: 'Recurrent presence on the home page',
				hide_nearby_venues: "Hide nearby venues in your venue's page"
			},
			error: {
				payment: "Still inactive, make sure you've confirmed the payment."
			},
			cancelled: {
				line1: 'Cancelled on {cancelDate}.',
				line2: 'Will work until {endDate}.'
			}
		},

		rating: {
			tooltip: '{value} out of {max}'
		}
	},

	// Pages ------------------------------------------------------------------
	pages: {
		home: {
			search: {
				title: 'Find the best games rooms near you.',
				subtitle:
					"It's easy with {name}, and with thousands of venues available, you're spoilt for choice!",
				label: 'Search',
				city_placeholder: 'Enter your city',
				location_placeholder: 'Near you',
				location: 'Use your current location',
				location_error: "We couldn't find your location.",
				submit: 'Search'
			},
			venue: {
				hint: 'Show your venue here'
			},
			explore: {
				title: 'Explore'
			},
			highlights: {
				title: 'Highlights'
			},
			new: {
				title: 'New'
			},
			promote: {
				intro: 'Excuse the pun',
				title: 'Get in the game',
				paragraph:
					"Add your venue or claim and manage an existing one. It's fast, and best of all, it's free!",
				register: 'Register as owner',
				add: 'Add your venue',
				manage: 'Manage your venues',
				more: 'Learn more'
			}
		},

		login: {
			meta_title: 'Sign in',
			title: 'Sign in',
			intro: 'Type your e-mail and password to sign in to {name}',
			email: 'E-mail address',
			email_error: 'Type your e-email address.',
			password: 'Password',
			password_error: 'Type your password.',
			submit: 'Sign in',
			submit_error: 'Incorrect e-mail or password.',
			forgot: 'Forgot password?',
			register1: 'Not registered yet? {link}',
			register2: 'Register now!'
		},

		register: {
			owner: {
				meta_title: 'Register as owner',
				title: 'Register to {name} as owner',
				intro: 'You will be able to claim your venue or publish a new one.'
			},

			user: {
				meta_title: 'Register',
				title: 'Register to {name}',
				intro: 'You will be able to favorite, rate and review venues.'
			},

			name: 'Name',
			name_error: 'Type your name.',
			email: 'E-mail address',
			email_error: 'Type your e-email address.',
			password: 'Password',
			password_error: 'Choose a password (8 characters minimum).',
			agree1:
				'Clicking on Register you agree to our {terms_link}. Find out how we use your data by reading our {privacy_link}.',
			agree2: 'Terms of Service',
			agree3: 'Privacy policy',
			submit: 'Register',
			submit_error: 'This e-mail address has been already used.',
			login1: 'Already registered? {link}',
			login2: 'Sign in'
		},

		forgot_password: {
			title: 'Reset password',
			intro:
				'Insert your e-mail address to receive a link to reset your password.',
			email: 'E-mail address',
			email_error: 'Type your e-email address.',
			submit: 'Send link',
			submit_success:
				'Done! If this e-mail address is a valid account you will get a message with a link to reset your password.'
		},

		reset_password: {
			title: 'Reset password',
			intro: 'Set a new password for your account.',
			email: 'E-mail address',
			email_error: 'Type your e-email address.',
			password: 'Password',
			password_error: 'Choose a password (8 characters minimum).',
			password_confirmation: 'Repeat password',
			password_confirmation_error: "Passwords don't match.",
			submit: 'Reset password',
			submit_error: "Your password couldn't be reset. Please try again."
		},

		explore: {
			meta_title: 'Explore',
			form: {
				location: {
					label: 'Location',
					geolocalization: 'User your current location',
					geolocalization_error: "We couldn't find your location.",
					placeholder: {
						default: 'Search...',
						geolocalization: 'Near you',
						in_map: 'Inside map bounds'
					}
				},
				distance: 'Distance',
				category: {
					label: 'Type',
					any: 'Any type'
				},
				amenities: 'Amenities',
				view: {
					list: 'List',
					map: 'Map'
				},
				results: 'No results | 1 result | {count} results'
			},
			list: {
				load_more: 'Load more results'
			},
			map: {
				search_area: 'Search this area'
			},
			start: {
				title: 'Enter your city name to begin'
			},
			no_items: {
				title: 'No venues found',
				subtitle: 'Move to a different area or change search filters.'
			}
		},

		venue_detail: {
			subtitle: '{category} in {city}',
			favorites: {
				add: 'Add to favorites',
				remove: 'Remove from favorites'
			},
			gallery: {
				add: 'Add photos',
				all: 'See all'
			},
			description: 'Description',
			details: {
				title: 'Details',
				concessionaire: 'Concessionaire',
				surface_size: 'Surface size',
				surface_size_unit: 'm²',
				vlt_machine_count: 'Slot machines',
				vlt_platforms: 'VLT platforms',
				awp_machine_count: 'AWP machines',
				arcade_roulette: 'Roulette',
				online_casino: 'Online casino',
				sports_betting: 'Sports betting',
				virtual_betting: 'Virtual betting',
				horse_betting: 'Horse betting',
				parking_capacity: 'Parking spots',
				seating_capacity: 'Seatings'
			},
			amenities: 'Amenities',
			card: {
				directions: 'Get directions',
				closed: 'Closed',
				open_now: 'Open now',
				closed_now: 'Closed',
				no_hours: 'No business hours info',
				no_contact: 'No contact info',
				no_urls: 'No site or social network profile'
			},
			reviews: {
				title: 'Rating and reviews',
				count: '1 rating | {count} ratings',
				all: 'See all',
				rate: 'Click to rate',
				rate_success: 'Thanks for your feedback',
				write: 'Leave a review',
				login: '{action} to rate or review this venue.',
				login_action: 'Login'
			},
			claim: {
				title: 'Is this your venue?',
				intro:
					"If you're the owner of this venue, you can claim it for free and keep it updated, add photos, jackpots, and more.",
				more: 'Learn more',
				action: 'Claim this venue'
				// subject: 'Claim venue: {name} (id: {id})'
			},
			report: {
				title: 'Found an error?',
				intro:
					'If the address is incorrect, the venue has shut down, or if there are offensive photos, you can report it.',
				action: 'Report this venue',
				subject: 'Report: {name} (id: {id})'
			},
			nearby: 'Venues nearby',
			common: {
				edit: 'edit',
				unknown: 'unknown',
				yes: 'Yes',
				no: 'No'
			}
		},

		venue_reviews: {
			meta_title: 'All reviews for {name}',
			title: 'All reviews',
			no_items: {
				title: 'No reviews',
				subtitle: 'This venue has no reviews.'
			}
		},

		venue_claim: {
			meta_title: 'Claim venue: {name}',
			title: 'Claim venue',
			intro:
				"You're about to claim the following venue, which is not managed by anybody. It will be assigned to you and you'll be able to edit its data.",
			continue: 'To continue, please click “Continue”.',
			submit: 'Continue',
			back: 'Go back to the venue',
			infobox: {
				title: "It's free!",
				body:
					'Managing a venue is completely free. If you wish, you will be able subscribe to pay a monthly subscription to promote it.',
				action: 'Learn more'
			}
		},

		// /user ---------------------------------------------------------------
		user: {
			// /user/
			index: {
				title: 'My account',
				logout: 'Logout',
				venues_label: 'Manage venues',
				venues_count: 'No venue added | 1 venue | {count} venues',
				info_label: 'Personal information',
				info_sublabel: 'Name, e-mail, language',
				billing: 'Billing information',
				favorites: 'Favorites',
				password: 'Change password'
			},

			// /user/venues
			venues: {
				// /user/venues/
				index: {
					title: 'Manage venues',
					subtitle_first: 'Start by adding your first venue.',
					subtitle_edit: 'Click one of them to edit.',
					add_first: 'Add your first venue',
					add_another: 'Add another venue'
				},

				// /user/venues/add
				add: {
					meta_title: 'Add venue',
					title: 'Add your venue',
					step_1: {
						title: "What's the name of your venue?",
						subtitle: "Make sure it's the same as the venue sign outside.",
						name: 'Name',
						name_error: 'Type the venue name.'
					},
					step_2: {
						title: 'Where is it?',
						subtitle: 'Insert the full address.',
						address: 'Address',
						address_line1_placeholder: 'Line 1',
						address_line2_placeholder: 'Line 2',
						address_error: 'Fill in all address data.',
						city: 'City',
						zipcode_province: 'Zip code & province',
						zipcode_placeholder: 'Zip code',
						province_placeholder: 'Province',
						country: 'Country'
					},
					step_3: {
						title: "What's the exact location?",
						subtitle:
							"Let your customer find you mor easily. Drag the map so the pin matches your venue's building.",
						location: 'Location'
					},
					step_4: {
						title: 'Which of the following categories apply?',
						subtitle: 'Choose at least one.',
						categories: 'Categories',
						categories_error: 'Please choose at least one category.'
					}
				},

				// /user/venues/{id}
				detail: {
					title: 'Venue detail',
					menus: {
						overview: 'Overview',
						general: 'General info',
						services: 'Services',
						photos: 'Photos',
						contacts: 'Contacts',
						hours: 'Business hours',
						jackpots: 'Jackpots',
						// reviews: 'Reviews',
						plan: 'Plan'
					},
					overview: {
						title: 'Overview',
						stats: {
							ratings: '{count} rating | {count} ratings',
							reviews: 'No reviews | 1 review | {count} reviews',
							favorites:
								'Favorited by {count} person | Favorited by {count} people'
						},
						visits: {
							title: 'Visits',
							count: '{count} visit | {count} visits',
							total: 'No visits | 1 total visit | {count} total visits'
						}
					},
					general: {
						title: 'General info',
						name: 'Name',
						name_placeholder: 'Ex.: Las Vegas Casino',
						name_error: 'Type the venue name.',
						concessionaire: 'Concessionaire',
						concessionaire_none: 'None',
						description: 'Description',
						surface_size: 'Surface size',
						surface_size_unit: 'm²',
						surface_size_error: "Insert the venue's surface size.",
						category: 'Category',
						category_error: 'Choose at least a category.',
						address: 'Address',
						address_line1_placeholder: 'Line 1',
						address_line2_placeholder: 'Line 2',
						address_error: 'Fill in all address data.',
						city: 'City',
						zipcode_province: 'Zip code & province',
						zipcode_placeholder: 'Zip code',
						province_placeholder: 'Province',
						country: 'Country',
						location: 'Location',
						location_searching: 'Searching',
						location_hint: 'Drag to reposition'
					},
					services: {
						title: 'Services',
						invalid_value: 'Invalid value.',
						sports_betting: 'Sports betting',
						virtual_betting: 'Virtual betting',
						horse_betting: 'Horse betting',
						arcade_roulette: 'Roulette',
						vlt_machine_count: 'Slot machines',
						awp_machine_count: 'AWP machines',
						seating_capacity: 'Seatings',
						parking_capacity: 'Parking spots',
						vlt_platforms: 'VLT platforms',
						amenities: 'Amenities'
					},
					photos: {
						title: 'Photos',
						reorder: 'Drag images to reorder.',
						delete: {
							title: 'Delete photo',
							intro:
								'Do you want to {action}?. It will be removed from the gallery but will be really deleted only once you save this venue.',
							intro_action: 'delete this photo'
						},
						no_items: {
							title: 'No photos',
							subtitle: 'Add the first one using the Upload button.'
						}
					},
					contacts: {
						title: 'Contacts',
						phone: 'Phone number',
						email: 'E-mail',
						email_placeholder: 'Ex.: name@gmail.com',
						email_error: 'Type a valid e-mail address.',
						url_placeholder: 'https://',
						url_error:
							"Type a valid URL, starting with 'http://' or 'https://'.",
						site: 'Website',
						online_casino: 'Online casino',
						facebook: 'Facebook page'
					},
					hours: {
						title: 'Business hours',
						always: 'Always open (24h)',
						full: 'All day',
						split: 'Split hours',
						closed: 'Closed',
						from_to: 'From/to',
						morning: 'Morning (from/to)',
						afternoon: 'Afternoon (from/to)'
					},
					jackpots: {
						title: 'Jackpots',
						name: 'Jackpot {number}',
						name_placeholder: 'Name',
						amount_placeholder: 'Amount'
					},
					reviews: {
						title: 'Reviews'
					},
					plan: {
						title: 'Plan',
						current: {
							title: 'Current plan',
							price: '{price}/month',
							payment_pending: {
								title: 'Payment confirmation pending',
								check:
									'Check your e-mail inbox for any payment confirmation requests and follow the on-screen instructions.',
								cancel:
									'If you want to cancel the subscription and start over, click the button below.',
								action: 'Start over'
							},
							ends: {
								title: 'Ends {date}',
								cancelled: 'You cancelled {date}.',
								action: 'Edit subscription'
							},
							renews: {
								title: 'Renews {date}',
								action: 'Edit subscription'
							}
						},
						pick_new: 'Pick a new subscription plan',
						selected_free:
							'You selected the free plan. This will deactivate your current subscription and your credit card will not be charged anymore. The subscription will keep working till the end of the period, on {date}.',
						selected_paid: 'You selected a paid plan.',
						selected_paid_input_data:
							'Please insert you billing information and payment method.',
						selected_paid_review_data:
							'Make sure your billing information and payment method are up to date.',
						resume:
							"You cancelled this subscription on {last_update_date}, but it was being kept active until {end_date}. Subscribing again won't charge your card until that date!",
						billing: {
							title: 'Billing',
							current: 'Use the currently registered billing address',
							new: 'Use a new address',
							new_warning: {
								message:
									'{warning} if you have an active subscription on your other venues, they will be updated to use the new billing information.',
								warning: 'Warning:'
							},
							legal_name: 'Legal name',
							legal_name_error: 'Please type your company legal name.',
							address: 'Address',
							address_error: 'Please type the address.',
							postcode: 'Postal code',
							postcode_error: 'Please type the postal code.',
							city: 'City',
							city_error: 'Please type the city name.',
							region: 'Region',
							region_error: 'Please type the region.',
							country: 'Country',
							country_error: 'Please select the country.',
							vat_number: 'VAT number',
							vat_number_error: 'Please type the VAT number.'
						},
						payment: {
							title: 'Payment method',
							current: 'Use the currently registered credit card',
							new: 'Use a new credit card',
							new_warning: {
								message:
									'{warning} if you have an active subscription on your other venues, they will be updated to use the new payment method.',
								warning: 'Warning:'
							},
							card: 'Credit card',
							card_expiration: 'Expiration date',
							card_holder_name: 'Card holder name',
							card_holder_name_error:
								'Please type the card holder name as shown on the card itself'
						},
						cancel: 'Cancel subscription',
						confirm: {
							title: 'Confirm subscription',
							paragraph1:
								'This is a continuous subscription. By clicking {confirm}, you authorise {name} to charge you the subscription cost monthly (currently {price}/month). You can cancel at any time.',
							paragraph2:
								"By continuing, you agree to the {name}'s {tos} and {privacy}. You also agree that your purchase will be available immediately and that you waive your statutory right of withdrawal.",
							paragraph2_tos: 'Terms of Service',
							paragraph2_privacy: 'Privacy policy',
							submit: 'Confirm subscription'
						},
						form_error:
							'Looks like the form is incomplete: please fill out all required fields before continuing.',
						submit_error:
							'There was an error while trying to setup your subscription. The support team has already been informed. Please try again later.',
						subscription_confirm: {
							title: 'Payment confirmation required',
							message:
								'We need your payment confirmation. Please check your e-mail and follow the instructions.'
						},
						subscription_success: {
							title: 'Subscription successful',
							message:
								'You subscription is now active. It will renew automatically on {date}, unless you cancel it before that date.'
						},
						cancellation_success: {
							title: 'Subscription cancelled',
							message:
								"You subscription's auto renew has been disabled. The subscription will remain active until {date}, but you won't be charged again."
						}
					}
				}
			},

			// /user/info
			info: {
				title: 'Personal information',
				name: 'Name',
				name_error: 'Please type your name.',
				name_hint:
					'Shown on your venue reviews and on messages and/or notifications you may receive from {name}.',
				email: 'E-mail address',
				newsletter: 'Keep me informed with new features and deals',
				locale: 'Language and region',
				locale_error: 'Please select your preferred language and region',
				submit_success_title: 'Information saved',
				submit_success_text: 'Your personal information have been updated.'
			},

			// /user/billing
			billing: {
				title: 'Billing information',
				intro: 'Will be used to generate all your invoices.',
				legal_name: 'Legal name',
				legal_name_error: 'Please type your company legal name.',
				address: 'Address',
				address_error: 'Please type the address.',
				postcode: 'Postal code',
				postcode_error: 'Please type the postal code.',
				city: 'City',
				city_error: 'Please type the city name.',
				region: 'Region',
				region_error: 'Please type the region.',
				country: 'Country',
				country_error: 'Please select the country.',
				vat_number: 'VAT number',
				vat_number_error: 'Please type the VAT number.',
				submit_success_title: 'Billing info saved',
				submit_success_text: 'Your billing information have been updated.'
			},

			// /user/favorites
			favorites: {
				title: 'Manage favorites',
				no_items: {
					title: 'No favorites saved',
					subtitle: 'You can add a favorite anytime while browsing the site.'
				}
			},

			// /user/password
			password: {
				title: 'Change password',
				intro: 'Type a new password below to change it.',
				password: 'New password',
				password_hint: 'At least 8 chars, letters and numbers',
				password_error: 'Please type at least 8 chars, letters and numbers.',
				password_confirmation: 'Repeat password',
				password_confirmation_error: "Passwords don't match.",
				submit: 'Change password',
				submit_success_title: 'Password changed',
				submit_success_text: 'Your password has been changed successfully.'
			}
		},

		promote: {
			meta_title: 'Promote your venue',
			hero: {
				title: "Promote your venue, it's free!",
				paragraph:
					'Are you the owner of a game-related business looking for new ways to promote it? Your venue is already listed on {name} and you would like to show more information to visitors? In both cases, {strong}',
				paragraph_strong: "you're in the right place!"
			},
			example: {
				paragraph1:
					'Adding your business or claiming an existing venue will allow you to reach to future clients by just adding basic information like business hours, photos, machine count and machine types, benefits, venue description and more.',
				paragraph2:
					'Here you an example venue with additional information, like photos {1}, custom jackpots {2}, details and services {3}, and contact information {4}.',
				paragraph3:
					"The more the information, the more you'll gather visitors. For example, displaying the business hours allows night owls to know if your venue is open in less canon hours.",
				paragraph4:
					'{name} is often consulted by players that are looking where to spend their free time, and they could be choosing your place!'
			},
			cost: {
				title: 'How much will it cost?',
				paragraph1:
					"Absolutely nothing! {name} provides different plans: {strong}; you won't spend anything except a little time.",
				paragraph1_strong:
					'adding a venue or claiming it to add basic information is completely free',
				paragraph2:
					"Once in {name}'s catalog, you may choose to highlight your business and make it easier to find by simply buying a monthly subscription which you could disable anytime. No hidden costs!"
			},
			start: {
				title: 'What are you waiting? Start now!',
				paragraph1:
					"If you're still doubtful, you really shouldn't. Adding or claiming your venue will only bring benefits. You will be able to customize your business' presence on {name} and autonomously update its information.",
				paragraph2:
					"If you already found your business on {name}, click on “{strong}” in the business detail page to continue. If you haven't already, you will need to register.",
				paragraph2_strong: 'Claim this venue'
			},
			manage: 'Manage your venue',
			register: 'Register as owner now'
		},

		about: {
			meta_title: 'About & Contact',
			company: {
				title: 'About {name}',
				paragraph1:
					'{name} is a start-up that combines, on the one hand, the technological capacities of the web and, on the other, the experience in the gaming industry at worldwide level.',
				paragraph2:
					'The international scenario of the Gambling Industry lacked a service like {name} that allows meeting people who are looking for legal gambling and the ones who provide it. We ensure high-quality service to the guests of casinos who – also thanks to our start-up – will choose where to spend their own valuable free time.',
				paragraph3:
					'The user can gather all information such as the number of machines, the type of slot and VLT machines or live games, opening hours, catering services, benefits and events that the gaming room has to offer.',
				paragraph4:
					'Through our platform, the operator will be able to communicate with potential customers with a simplicity ever experienced in the gambling industry.',
				paragraph5:
					'Our policy is strictly sensitive to responsible gaming. In fact, we give preferential visibility to reliable casinos with qualified staff who has attendance certificates for courses focused on tackling the problem of Pathological Gaming'
			},
			contact: {
				title: 'Contact us',
				intro:
					"Drop us a line at one of the email addresses below. We'll do our best to reply as soon as possible.",
				info: 'For generic information:',
				help:
					'To receive support for managing your account, venue or subscription:',
				report: 'To report an issue:'
			}
		},

		play_responsibly: {
			meta_title: 'Play responsibly'
		},

		errors: {
			basic: {
				not_found: 'Page not found',
				server_error: 'Server error',
				back: 'Go back to the home page'
			},
			venue_closed: {
				title: 'Oops!',
				message_1: 'This venue does not exist or has been closed.',
				message_2: 'Have a look at the the venues nearby.'
			}
		}
	},

	// Data -------------------------------------------------------------------
	data: {
		subscriptions: {
			default: 'Free',
			silver: 'Silver',
			gold: 'Gold'
		},
		categories: {
			adult_gaming_center: 'Adult gaming centre',
			betting_shop: 'Betting shop',
			bingo: 'Bingo hall',
			card_room: 'Card room',
			casino: 'Casino',
			family_entertainment_center: 'Family entertainment centre',
			vlt: 'VLT game room'
		},
		amenities: {
			air_conditioning: 'Air conditioning',
			atm: 'ATM',
			bar: 'Bar',
			pay_per_view: 'Pay Per View',
			pos: 'POS',
			private_parking: 'Private parking',
			private_room: 'Private room',
			restaurant: 'Restaurant',
			security: 'Security',
			smoking_area: 'Smoking area',
			wifi: 'Wi-Fi'
		}
	}
}

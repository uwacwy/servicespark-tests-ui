var installation_uri = "http://ubkk407a4c74.bradkovach.koding.io/servicespark/";
var server = 'http://ubkk407a4c74.bradkovach.koding.io';
var folder = 'servicespark';

var solution_name = "My Service Site";

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}

module.exports = {
	'User Login Goes to activity' : function(test)
	{
		test
			.open(installation_uri)
			.waitForElement('html.js')
			.assert
				.title()
				.is(unescape("Home – My Service Site"), "Home Page Loads")
			.type('#UserUsername', 'volunteer')
			.type('#UserPassword', 'volunteer')
			.click('#UserLoginForm input[type=submit]')
			.assert
				.url()
				.is(installation_uri + 'users/activity', 'Login Succeeded')
			.done();
	},
	'User Can Log Ad-Hoc Time' : function(test)
	{
		var now = new Date(),
			month = now.getMonth(),
			day = now.getDay(),
			year = now.getFullYear(),

			start_hour = now.getHours() + 1,
			end_hour = now.getHours() + 2,
			start_meridian = 'am',
			end_meridian = 'pm'
			;

		if(start_hour > 12)
		{
			start_hour = start_hour - 12;
			start_meridian = 'pm';
		}

		if(end_hour > 12)
		{
			end_hour = end_hour - 12;
			end_meridian = 'pm';
		}

		if(end_hour < start_hour)
		{
			test
			.log.message("This test is not designed to handle events spanning two days").
			done();

			return;
		}


		test
			.log.message( now.toISOString() )
			.log.message( start_hour )
			.log.message( end_hour )
			.open(installation_uri + 'volunteer/times')
			.click("#organization-heading a[data-toggle=collapse]")
			.wait(250)
			.assert
				.visible("#organization", "Organization Panel Expands On Click")
			.submit("#OrganizationVolunteerIndexForm")
			.setValue("#TimeStartTimeHour", '7' )			
			.setValue("#TimeStartTimeMin", '00')			
			.setValue("#TimeStartTimeMeridian", 'pm')			
			.setValue("#TimeStopTimeHour", '8' )			
			.setValue("#TimeStopTimeMin", "00")			
			.setValue("#TimeStopTimeMeridian", "pm")
			
			.type("#OrganizationTime0Memo", "Volunteer submitting time " + now.toISOString() )
			
			.submit("#TimeVolunteerInForm")
			.assert
				.exists('.alert.alert-success', "Ad-Hoc Time was submitted successfully")
			//.screenshot('screens/times/organization/submit-:timestamp.png')
			.done();
	},
	'User Can Log Out': function(test)
	{
		test
			.open(installation_uri + 'users/logout')
			.assert
				.url(installation_uri, 'Log Out Succeeded')
			.done()
	},
	'Coordinator Login': function(test)
	{
		test
			.open(installation_uri)
			.waitForElement('html.js')
			.assert
				.title()
				.is(unescape("Home – My Service Site"), "Home Page Loads")
			.type('#UserUsername', 'coordinator')
			.type('#UserPassword', 'coordinator')
			.click('#UserLoginForm input[type=submit]')
			.assert
				.url()
				.is(installation_uri + 'users/activity', 'Login Succeeded')
			.done();
	},
	'Coordinator Can Approve': function(test)
	{
		test
			.open(installation_uri + 'coordinator/times/approve')
			.click('.actionable .api-trigger.times-approve')
			.waitForElement('.toast')
			.assert
				.exists('.toast', 'Approval API Worked')
			//.screenshot('screens/times/approved-:timestamp.png')
			.done();
	},
	'Coordinator Can Create Event': function(test)
	{
		var now = new Date();

		var ajax_wait = 250;

		var in_token = "",
			out_token = "";

		// http://www.w3.org/TR/2012/WD-webdriver-20120710/#character-types
		test
			.open(installation_uri + "coordinator/events/add")
			.type("#EventTitle", "Test Event Created  At " + now.toISOString() )
			.type("#EventDescription", "Test Event Description")
			.type("#EventRsvpDesired", "15")
			.setValue("#EventStartTimeHour", '7')
			.setValue('#EventStartTimeMin', '0')
			.setValue("#EventStartTimeYear", now.getFullYear() + 1 + "")
			.setValue("#EventStopTimeHour", '8')
			.setValue("#EventStopTimeMin", '0')
			.setValue("#EventStopTimeYear", now.getFullYear() + 1 + "")		
			.type("#EventSkill", "ServiceSpark")
			.wait(ajax_wait)
			.sendKeys("#EventSkill", '\uE015\uE007')
			.type("#EventSkill", "Microsoft Office")
			.wait(ajax_wait)
			.sendKeys("#EventSkill", '\uE015\uE007')
			.type("#EventSkill", "Microsoft Excel")
			.wait(ajax_wait)
			.sendKeys("#EventSkill", '\uE015\uE007')
			.wait(ajax_wait)
			.screenshot('screens/creating-event-:timestamp.png')
			.submit("#EventCoordinatorAddForm")
			.assert
				.exists("div.event", "Events Are Creating Properly")
			.assert
				.exists("div.addresses", "Addresses Found")
			.assert
				.exists("div.skills", "Skills container found")
			.assert
				.numberOfElements('.skills .skill', 3, "Skills were properly attached to the event")
			.type("#CommentCoordinatorViewForm textarea", "This is a unit test comment " + now.toISOString() )
			.submit("#CommentCoordinatorViewForm")
			.assert
				.numberOfElements('.comments .comment', 1, "Comments engine is working properly")
			.screenshot('screens/events/created-:timestamp.png')
			.done()

	}
};
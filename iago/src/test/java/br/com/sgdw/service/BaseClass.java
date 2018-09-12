package br.com.sgdw.service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.IMongodConfig;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.config.Timeout;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;

@RunWith(SpringRunner.class)
@SpringBootTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@DirtiesContext
@EnableAutoConfiguration(exclude={EmbeddedMongoAutoConfiguration.class})
@ActiveProfiles("test")
public abstract class BaseClass {
	
	static final Logger log = Logger.getLogger(BaseClass.class);
	
	private static final int TIMEOUT = 120000;
	private static final int SLEEP_TIME = 7;
	private static final int PORT = 27017;
	private static final String LOCALHOST = "localhost";
	
	private static MongodExecutable mongodExecutable;
	
	public BaseClass() {
		
	}

	@BeforeClass 
	public static void init() throws IOException {
		
		MongodStarter starter = MongodStarter.getDefaultInstance();
	    IMongodConfig mongodConfig = new MongodConfigBuilder()
	            .version(Version.Main.PRODUCTION)
	            .net(new Net(LOCALHOST, PORT, Network.localhostIsIPv6()))
	            .timeout(new Timeout(TIMEOUT))
	            .build();
	    mongodExecutable = null;
	    try {
	        mongodExecutable = starter.prepare(mongodConfig);
	        mongodExecutable.start();
	    } catch (IOException e){
	    	log.error(e);
	        if (mongodExecutable != null) {
	        	mongodExecutable.stop();
	        }            
	    }		
	}
		
	@AfterClass
	public static void teardown(){
	    if (mongodExecutable != null) {
	    	mongodExecutable.stop();
	    }   
	    
		try {
			TimeUnit.SECONDS.sleep(SLEEP_TIME);
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			log.error(e);
		}
	}
}

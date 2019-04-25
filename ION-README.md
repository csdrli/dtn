# Setting UP DTN ION

### Software Requirements
ION requires the following software packages:

- Modern *nix OS: Currently tested on Ubuntu Linux (8.04, 7.10, 7.04), Gentoo  Linux, Fedora Core (3, 7), Apple OSX (10.5) and Solaris 10. Almost any 2.6 series or later Linux kernel should work.
- Standard GNU core tools (tar, gzip, etc).
- Standard GNU build tools (gcc, make).
- Optionally, the Expat XML parser (and development libraries).
- The POSIX Threading library (pthreads).
- Pod2man (perl tool for creating documentation files).
- For now, root privileges (via sudo) for installation.
- GNU autotools (autoconf, automake, libtool) make installation much easier, but are optional.
- Sed and awk required for some helper scripts.

### Setting Up
First, download and extract the source code.
```bash
wget 'http://downloads.sourceforge.net/project/ion-dtn/ion-3.4.0b.tar.gz'
tar -zxvf ion-3.4.0b.tar.gz
cd ion-open-source/
```
### Compiling Ion using autotools (suggested)

Follow the standard autoconf method for compiling the project. In the base ION directory run:
```bash
./configure
```

Then compile with:
```
make
```

After successful compilation, you should test that your system runs ION properly. This test currently sends data using ION over loopback. A secondary test is run for Apple OSX users, and it may require some modification in the amount of available shared memory (details are given in the output):

```
make test
```
Finally, install (requires root privileges):
```
sudo make install
```
Autotools will usually install packages such as this in the /usr/local/ directory tree. This is where the example configuration files and a copy of this tutorial will end up (that is, in the share/ion subdirectory). Please move on to post-installation. Note that if you do not have root privileges, or would like to only run ION locally, then adding the entire build directory to your PATH is advised - almost every ION-related program will attempt to call several others and will expect that they exist in the PATH.

## Quick Start Guide
Programs in Ion
The following tools are available to you after ION is built:

##### Daemon and Configuration:
ionadmin is the administration and configuration interface for the local ION node contacts and manages shared memory resources used by ION.
ltpadmin is the administration and configuration interface for LTP operations on the local ION node.
bsspadmin is the administrative interface for operations of the Bundle Streaming Service Protocol on the local ion node.
bpadmin is the administrative interface for bundle protocol operations on the local ion node.
ipnadmin is the administration and configuration interface for the IPN addressing system and routing on the ION node. (ipn:)
dtn2admin is the administration and configuration interface for the DTN addressing system and routing on the ION node. (dtn://)
killm is a script which tears down the daemon and any running ducts on a single machine (use ionstop instead).
ionstart is a script which completely configures an ION node with the proper configuration file(s).
ionstop is a script which completely tears down the ION node.
ionscript is a script which aides in the creation and management of configuration files to be used with ionstart.
##### Simple Sending and Receiving:
bpsource and bpsink are for testing basic connectivity between endpoints. bpsink listens for and then displays messages sent by bpsource.
bpsendfile and bprecvfile are used to send files between ION nodes.
##### Testing and Benchmarking:
bpdriver benchmarks a connection by sending bundles in two modes: request-response and streaming.
bpecho issues responses to bpdriver in request-response mode.
bpcounter acts as receiver for streaming mode, outputting markers on receipt of data from bpdriver and computing throughput metrics.

# Setting up the 2node ring

You can use 2 different virtual machine and set up the a host-only network between them where host1 has the ip ```192.168.56.101``` and host2 has the ip ```192.168.56.102```.

The configuration files are found in the ```configs/2node-stcp ```directory:
![alt text](https://compsat.files.wordpress.com/2014/09/2node.png)

THe configuration file for host1.rc is:
```
## Run the following command to start ION node: 
##% ionstart -I "host1.rc"

## begin ionadmin 
# ionrc configuration file for host1 in a 2 stcp method test. 
# This uses STCP as the primary convergence layer. 
# command:% ionadmin host1.ionrc 
# This command should be run FIRST. 
# Initialization command (command 1). 
# Set this node to be node 1 (as in ipn: 1). 
# Use default sdr configuration (empty configuration file name ""). 
1 1 '' 
# start ion node 
s 
## end ionadmin

## begin bpadmin 
# bprc configuration file for host1 in a 2 test method. 
#Command:% bpadmin host1.bprc
1
a scheme ipn 'ipnfw' 'ipnadminep'
a endpoint ipn:1.0 q
a endpoint ipn:1.1 q
a endpoint ipn:1.2 q
a protocol tcp 1400 100 
a induct tcp 192.168.56.101:4556 tcpcli 
a outduct tcp 192.168.56.101:4556 tcpclo 
a outduct tcp 192.168.56.102:4556 tcpclo 
s 
## end bpadmin

## begin ipnadmin

a plan 1 tcp/192.168.56.101:4556
a plan 2 tcp/192.168.56.102:4556
## end ipnadmin
```

The code for the configuration file host2.rc is:
```
## Run the following command to start ION node:
##% ionstart -I “host2.rc”

## begin ionadmin
# ionrc configuration file for host2 in a 2node stcp test.
# This uses stcp as the primary convergence layer.
# command: % ionadmin host2.ionrc
# This command should be run FIRST.
# Initialization command (command 2).
# Set this node to be node 2 (as in ipn:2).
# Use default sdr configuration (empty configuration file name “”).
1 2 ''
# start ion node
s
## end ionadmin

## begin bpadmin
# bprc configuration file for host2 in a 2node test.
#Command: % bpadmin host2.bprc
1
a scheme ipn 'ipnfw' 'ipnadminep'
a endpoint ipn:2.0 q
a endpoint ipn:2.1 q
a endpoint ipn:2.2 q
a protocol tcp 1400 100
a induct tcp 192.168.56.102:4556 tcpcli
a outduct tcp 192.168.56.102:4556 tcpclo
a outduct tcp 192.168.56.101:4556 tcpclo
s
## end bpadmin

## begin ipnadmin
a plan 2 tcp/192.168.56.102:4556
a plan 1 tcp/192.168.56.101:4556
## end ipnadmin
```
This network is setup by running the following command on Host 1:
```
ionstart -I host1.rc
```
Host 2 must run this command:
```
ionstart -I host2.rc
```

##   Examples
The following examples can be used to get started.

#### Hello World
Enter the follow lines into the terminal. Hit ^C to exit bpsink after verifying the payload has been delivered.
```
echo "Hello, World!" | bpsource ipn:1.1
bpsink ipn:1.1
# ^C to exit bpsink
```
A slightly unreliable single line hello world example is below.
```
{ echo "Hello, World!"; sleep 1; } | bpchat ipn:1.1 ipn:1.1
```
#### Chat
Use two terminals to enter the following commands. Enter text and hit enter to transfer the line to the other terminal. Hit ^C to exit.
```
# host1 terminal
bpchat ipn:1.1 ipn:2.1
# ^C to exit bpchat
```
```
# host2 terminal
bpchat ipn:2.1 ipn:1.1
# ^C to exit bpchat
```

# Stopping ION

Any ION can be stopped bu using the following program
```
ionstop
```
or you can use
```
killm
```

# -------------------------------------------------------------
Response Sender - server
```
#/bin/sh

SOURCE=ipn:1.1
DESTINATION=ipn:2.1
while true
do
for FILE in /home/kaushik/Desktop/dtn/website/DTN/requests/sign_up_requests/*;
do
FILENAME=$(basename "$FILE" .json)
if [[ $FILENAME =~ .*order.* ]]
then
	#echo "$FILENAME It's an order file"
	LAST_ORDER=$(awk 'NR==1{print $NF}' record.csv)	
	NEW_ORDER_NUMBER=$(echo $FILENAME | sed 's/[^0-9]*//g')
	LAST_SENT_ORDER_NUMBER=$(echo $LAST_ORDER | sed 's/[^0-9]*//g')
	if [ $(($NEW_ORDER_NUMBER + 0)) -gt $(($LAST_SENT_ORDER_NUMBER + 0)) ]
	then
		
		bpsendfile $SOURCE $DESTINATION "$FILE"
		sed -i "1s/$/, $FILENAME.json/" record.csv	
		echo "$FILENAME.json sent and added to the record."
	fi

fi
if [[ $FILENAME =~ .*signup.* ]]
then
	#echo "$FILENAME It's a signup file"
	LAST_SIGNUP=$(awk 'NR==2{print $NF}' record.csv)	
	NEW_SIGNUP_NUMBER=$(echo $FILENAME | sed 's/[^0-9]*//g')
        LAST_SENT_SIGNUP_NUMBER=$(echo $LAST_SIGNUP | sed 's/[^0-9]*//g')
	if [ $(($NEW_SIGNUP_NUMBER + 0)) -gt $(($LAST_SENT_SIGNUP_NUMBER)) ]
        then
		LAST_STRING=$(tail -1 $FILE)	
		if [ $LAST_STRING == "=====" ]
		then
			sed -i "1 i $FILENAME.json" $FILE
			echo "$FILENAME.json is sent over DTN"
			bpsendfile $SOURCE $DESTINATION "$FILE"
			sed -i "2s/$/, $FILENAME.json/" record.csv
			echo "$FILENAME.json sent and added to the record."
		fi
	fi
fi
if [[ $FILENAME =~ .*catalog.* ]]
then
	#echo "$FILENAME It's a catalog file"
	LAST_CATALOG=$(awk 'NR==3{print $NF}' record.csv)	
	NEW_CATALOG_NUMBER=$(echo $FILENAME | sed 's/[^0-9]*//g')
        LAST_SENT_CATALOG_NUMBER=$(echo $LAST_CATALOG | sed 's/[^0-9]*//g')
	if [ $(($NEW_CATALOG_NUMBER + 0)) -gt $(($LAST_SENT_CATALOG_NUMBER)) ]
        then
                bpsendfile $SOURCE $DESTINATION "$FILE"
                sed -i "3s/$/, $FILENAME.json/" record.csv
		echo "$FILENAME.json sent and added to the record."
        fi

fi
done
done
```

Code to receive the files:
```
#bin/sh

OWN_ENDPOINT=ipn:2.1

mkdir -p response

while true
do
	bprecvfile $OWN_ENDPOINT 1
	line=$(head -n 1 testfile1)
	mv testfile1 response/$line
	sed -i '1d; $d' response/$line
	echo "Received $line file."
done
```
